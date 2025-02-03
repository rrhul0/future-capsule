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
