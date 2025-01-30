'use server'

import getUser from '@/lib/getUser'
import { prisma } from '@prisma-client'

export type ActionReturnData = {
  status: 'failed' | 'success'
  error?: string
}

export const searchUserWithUserName = async (searchString: string) => {
  const userAuth = await getUser()
  const user = await prisma.user.findMany({
    where: {
      userName: {
        contains: searchString,
        mode: 'insensitive'
      },
      NOT: {
        OR: [
          { userName: userAuth.userName },
          {
            ContactedBy: {
              some: {
                id: userAuth.id
              }
            }
          }
        ]
      }
    },
    select: {
      id: true,
      name: true,
      userName: true
    }
  })
  return user
}

export const addUsersToContactsList = async (usernames: string[]): Promise<ActionReturnData> => {
  if (usernames.length === 0) {
    return { status: 'failed', error: 'No users to add' }
  }
  const userAuth = await getUser()
  try {
    await prisma.user.update({
      where: {
        id: userAuth.id
      },
      data: {
        Contacts: {
          connect: usernames.map((u) => ({ userName: u }))
        }
      }
    })
  } catch {
    return { status: 'failed', error: 'something went wrong' }
  }
  return { status: 'success' }
}
