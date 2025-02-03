'use server'

import { prisma } from '@prisma-client'
import dayjs from 'dayjs'
import getUser from '@/lib/getUser'
import { CapsuleSharingAccess, CapsuleStatus } from '@prisma/client'
import { signIn } from '@/auth'
import { createFirestoreNotificationEntry, NotificationData } from '@/lib/firebase'
import { getTimeLeft } from '@/utils/commonUtils'
import { createId } from '@paralleldrive/cuid2'

const capsulesSelectData = {
  id: true,
  content: true,
  scheduledTo: true,
  status: true,
  sharingAccess: true,
  ownerId: true,
  parentCapsule: {
    select: {
      owner: {
        select: {
          id: true,
          userName: true,
          name: true
        }
      }
    }
  },
  rootCapsule: {
    select: {
      owner: {
        select: {
          id: true,
          userName: true,
          name: true
        }
      }
    }
  }
}

export type CapsuleData = {
  id: string
  content: string
  scheduledTo: Date
  status: CapsuleStatus
  sharingAccess: CapsuleSharingAccess
  ownerId: string
  parentCapsule: { owner: { name: string|null; userName: string; id: string } } | null
  rootCapsule: { owner: { name: string|null; userName: string; id: string } }
}

export const getAllCapsules = async () => {
  const user = await getUser()
  return prisma.capsule.findMany({
    where: { ownerId: user.id, status: { not: 'NOT_ACCEPTED' } },
    orderBy: { scheduledTo: 'asc' },
    select: capsulesSelectData
  })
}

export type CapsuleCreateAction = {
  message: string
  timestamp: string
}

export type StatusType = 'success' | 'failed'

export const createCapsuleAction = async ({ message, timestamp }: CapsuleCreateAction) => {
  const user = await getUser()

  const diffInDays = dayjs(timestamp).diff(dayjs(), 'day', true)
  if (diffInDays < 1) {
    throw new Error('Capsule must be scheduled at least 24 hours in the future')
  }
  const cuidCapsule = createId()
  const capsule = await prisma.capsule.create({
    data: {
      id: cuidCapsule,
      content: message,
      scheduledTo: new Date(timestamp),
      status: 'PENDING',
      ownerId: user.id,
      rootCapsuleId: cuidCapsule
    },
    select: capsulesSelectData
  })

  return capsule
}

export const changeSharingAccess = async (capsuleId: string, sharingAccess: CapsuleSharingAccess) => {
  const user = await getUser()

  const capsule = await prisma.capsule.update({
    where: { id: capsuleId, ownerId: user.id },
    data: { sharingAccess: sharingAccess },
    select: capsulesSelectData
  })

  if (!capsule) {
    throw new Error('You do not have permission to change sharing access or capsule not found')
  }

  return capsule
}

export const shareCapsule = async ({
  capsuleId,
  userIds,
  acceptSharedCapsule = false
}: {
  capsuleId: string
  userIds: string[]
  acceptSharedCapsule?: boolean
}): Promise<{ status: StatusType; error?: string } | { userId: string; status: StatusType; error?: string }[]> => {
  const currentUser = await getUser()

  const capsule = await prisma.capsule.findUnique({
    where: { id: capsuleId }
  })
  if (!capsule) return { error: 'Capsule not found', status: 'failed' }

  const ownerUserId = acceptSharedCapsule ? capsule.ownerId : currentUser.id

  // 1. Check if current user owns the capsule
  // do not check it user is accepting the shared capsule by link
  if (!acceptSharedCapsule && capsule.ownerId !== currentUser.id)
    return { error: 'Capsule is not owned by you', status: 'failed' }

  // 2. Check if user have more then 24 hours expire time
  if (dayjs(capsule?.scheduledTo).diff(dayjs(), 'day') < 1)
    return { error: 'Capsule must be scheduled at least 24 hours in the future', status: 'failed' }

  // 3. check if capsule have compatible sharing access
  if (
    (acceptSharedCapsule && capsule.sharingAccess !== 'ANYONE_WITH_LINK') ||
    (!acceptSharedCapsule && capsule.sharingAccess === 'NO_ONE')
  )
    return { error: 'Capsule cant be shared, change the permission first', status: 'failed' }

  // 4. Check if current user isn't blocked by any user to which capsule is shared
  // or if any user to which capsule is shared is blocked by current user
  const currentUserData = await prisma.user.findUnique({
    where: { id: ownerUserId },
    select: {
      BlockedUsers: { select: { id: true } },
      BlockedBy: { select: { id: true } },
      DefaultAccepedBy: { select: { id: true } }
    }
  })
  if (!currentUserData) return { error: 'User not found', status: 'failed' }

  const blockedCurrentUser = currentUserData.BlockedBy.map((user) => user.id)
  const blockedByCurrentUser = currentUserData.BlockedUsers.map((user) => user.id)
  const defaultAccepedBy = currentUserData.DefaultAccepedBy.map((user) => user.id)

  const results = await Promise.all(
    userIds.map(async (userId): Promise<{ status: StatusType; userId: string; error?: string }> => {
      if (blockedCurrentUser.includes(userId))
        return { userId, error: 'You are blocked by this user, cant send capsule', status: 'failed' }
      if (blockedByCurrentUser.includes(userId))
        return { userId, error: 'You have blocked this user,cant send capsule', status: 'failed' }

      // 5. check if the same capsule (check for root capsuleId) is already present in users capsule's
      const isCapsuleAlreadyShared = await prisma.capsule.findFirst({
        where: { ownerId: userId, rootCapsuleId: capsule.rootCapsuleId ?? capsuleId },
        include: { owner: true }
      })

      if (isCapsuleAlreadyShared) return { userId, error: 'Capsule already shared with this user', status: 'failed' }

      const isDefaultAcceped = defaultAccepedBy.includes(userId)
      try {
        await prisma.capsule.create({
          data: {
            content: capsule.content,
            ownerId: userId,
            scheduledTo: capsule.scheduledTo,
            status: isDefaultAcceped ? 'PENDING' : 'NOT_ACCEPTED',
            sharingAccess: 'NO_ONE',
            parentCapsuleId: capsuleId,
            rootCapsuleId: capsule.rootCapsuleId ?? capsuleId
          }
        })
      } catch {
        return { userId, error: 'Error while sharing capsule', status: 'failed' }
      }

      // create a firestore notification entry for the user which is receiving the capsule
      const notificationData: NotificationData = {
        title: 'Received a capsule',
        message: `You have received a capsule from ${currentUser.name}, and will be opened after ${getTimeLeft(
          capsule.scheduledTo
        )}`,
        userId,
        sentBy: {
          name: currentUser.name ?? undefined,
          userId: currentUser.id,
          userName: currentUser.userName
        }
      }
      await createFirestoreNotificationEntry(notificationData)

      return { userId, status: 'success' }
    })
  )
  return results
}

export const acceptLinkSharedCapsule = async ({ id, userId }: { id: string; userId?: string }) => {
  if (!userId) await signIn('', { redirectTo: `/share/capsule/${id}?accept=true` })
  else return shareCapsule({ capsuleId: id, userIds: [userId], acceptSharedCapsule: true })
}
