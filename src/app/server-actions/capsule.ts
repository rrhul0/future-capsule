'use server'

import { prisma } from '@prisma-client'
import dayjs from 'dayjs'
import getUser from '@/lib/getUser'
import { CapsuleSharingAccess } from '@prisma/client'

export type CapsuleCreateAction = {
  message: string
  timestamp: string
}

export type StatusType = 'success' | 'failed'

export const createCapsuleAction = async ({ message, timestamp }: CapsuleCreateAction) => {
  const user = await getUser()

  const diffInDays = dayjs(timestamp).diff(dayjs(), 'day', true)
  if (diffInDays < 1) {
    return { error: 'Capsule must be scheduled at least 24 hours in the future' }
  }

  await prisma.capsule.create({
    data: {
      content: message,
      scheduledTo: new Date(timestamp),
      status: 'PENDING',
      ownerId: user.id
    }
  })

  return { status: 'success' }
}

export const changeSharingAccess = async (capsuleId: string, sharingAccess: CapsuleSharingAccess) => {
  const user = await getUser()

  const capsule = await prisma.capsule.update({
    where: { id: capsuleId, ownerId: user.id },
    data: { sharingAccess: sharingAccess }
  })

  if (!capsule) {
    return { error: 'You do not have permission to change sharing access or capsule not found' }
  }

  return { status: 'success', newAccess: sharingAccess }
}

export const shareCapsule = async ({
  capsuleId,
  userIds
}: {
  capsuleId: string
  userIds: string[]
}): Promise<{ status: StatusType; error?: string } | { userId: string; status: StatusType; error?: string }[]> => {
  const currentUser = await getUser()

  // 1. Check if current user owns the capsule
  // 2. check if capsule have compatible sharing access
  const capsule = await prisma.capsule.findUnique({
    where: { id: capsuleId }
  })
  if (!capsule) return { error: 'Capsule not found', status: 'failed' }
  if (capsule.ownerId !== currentUser.id) return { error: 'Capsule is not owned by you', status: 'failed' }
  if (capsule.sharingAccess === 'NO_ONE')
    return { error: 'Capsule cant be shared, change the permission first', status: 'failed' }

  // 3. Check if current user isn't blocked by any user to which capsule is shared
  // or if any user to which capsule is shared is blocked by current user
  const currentUserData = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: {
      BlockedUsers: {
        select: {
          id: true
        }
      },
      BlockedBy: {
        select: {
          id: true
        }
      },
      DefaultAccepedBy: {
        select: {
          id: true
        }
      }
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

      // 4. check if the same capsule (check for root capsuleId) is already present in users capsule's
      const isCapsuleAlreadyShared = await prisma.capsule.findFirst({
        where: { ownerId: userId, rootCapsuleId: capsule.rootCapsuleId }
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
      return { userId, status: 'success' }
    })
  )
  return results
}
