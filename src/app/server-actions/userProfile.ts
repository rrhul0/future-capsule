'use server'

import getUser from '@/lib/getUser'
import { prisma } from '@prisma-client'

export const getUserData = async (): Promise<UserDataType> => {
  const user = await getUser()
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      userName: true,
      image: true,
      nickname: true,
      recipientServices: { select: { id: true, serviceValue: true, type: true } },
      Contacts: { select: { id: true, name: true, userName: true } },
      BlockedUsers: { select: { id: true, name: true, userName: true } },
      DefaultAcceptUsers: { select: { id: true, name: true, userName: true } }
    }
  })
  if (!userData) throw new Error('User not found')
  return userData
}

const userProfileSelect = {
  id: true,
  name: true,
  userName: true,
  image: true,
  timezone: true,
  locale: true
}

export const getUserProfile = async (): Promise<UserProfileType> => {
  const user = await getUser()
  const userProfileData = await prisma.user.findUnique({
    where: { id: user.id },
    select: userProfileSelect
  })
  if (!userProfileData) throw new Error('User not found')
  return userProfileData
}

export const updateUserProfile = async (data: UserProfileType) => {
  const user = await getUser()
  if (!data.name || !data.userName || !data.image) {
    throw new Error('Missing required fields')
  }
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name,
      userName: data.userName,
      image: data.image
    },
    select: userProfileSelect
  })
  return updatedUser
}

const capsulesConfigurationSelect = {
  maxCapsuleDelay: true,
  minCapsuleDelay: true
}

export const getCapsulesConfiguration = async (): Promise<CapsulesConfigurationType> => {
  const user = await getUser()
  const capsulesConfiguration = await prisma.user.findUnique({
    where: { id: user.id },
    select: capsulesConfigurationSelect
  })
  if (!capsulesConfiguration) throw new Error('User not found')
  return capsulesConfiguration
}

export const updateCapsulesConfiguration = async (data: CapsulesConfigurationType) => {
  const user = await getUser()
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      maxCapsuleDelay: data.maxCapsuleDelay,
      minCapsuleDelay: data.minCapsuleDelay
    },
    select: {
      ...userProfileSelect,
      ...capsulesConfigurationSelect
    }
  })
  return updatedUser
}

export const getUserRecipients = async () => {
  const user = await getUser()
  if (!user) throw new Error('User not found')
  const recipients = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      recipientServices: {
        select: {
          id: true,
          serviceValue: true,
          type: true,
          connectedByAccount: {
            select: {
              type: true,
              providerAccountId: true,
              provider: true
            }
          }
        }
      }
    }
  })
  if (!recipients) throw new Error('User reciepients not found')
  return recipients?.recipientServices
}

export const disconnectRecipient = async (id: string) => {
  const user = await getUser()
  if (!user) throw new Error('User not found')
  const recipient = await prisma.userRecipientService.delete({
    where: { id, userId: user.id }
  })
  if (!recipient) throw new Error('Recipient was not found')
  const leftRecipients = getUserRecipients()
  return leftRecipients
}

export const disconnectAccount = async (serviceId: string, accountId: string, provider: string) => {
  const user = await getUser()
  if (!user) throw new Error('User not found')
  const account = await prisma.account.delete({
    where: {
      provider_providerAccountId: {
        providerAccountId: accountId,
        provider
      },
      userRecipientServiceId: serviceId
    }
  })
  if (!account) throw new Error('Account was not found')
  const leftRecipients = getUserRecipients()
  return leftRecipients
}
