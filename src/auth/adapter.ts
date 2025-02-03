import { type PrismaClient } from '@prisma/client'
import type { Adapter, AdapterAccount } from '@auth/core/adapters'
import { prisma } from '@prisma-client'
import { Account } from 'next-auth'

export function PrismaAdapter(prisma: PrismaClient | ReturnType<PrismaClient['$extends']>): Adapter {
  const p = prisma as PrismaClient
  return {
    getUser: async (id) => {
      const user = await p.user.findUnique({ where: { id } })
      if (!user) return null
      const reciepentService = await p.userRecipientService.findFirst({
        where: {
          type: 'EMAIL',
          userId: user.id
        }
      })
      if (!reciepentService) return null
      return { ...user, email: reciepentService?.serviceValue, emailVerified: reciepentService?.createdAt }
    },
    getUserByEmail: async (email) => {
      const reciepentService = await p.userRecipientService.findFirst({
        where: { type: 'EMAIL', serviceValue: email },
        include: {
          user: true
        }
      })
      if (!reciepentService) return null
      return {
        ...reciepentService.user,
        email: reciepentService?.serviceValue,
        emailVerified: reciepentService?.createdAt
      }
    },
    async getUserByAccount(provider_providerAccountId) {
      const account = await p.account.findUnique({
        where: { provider_providerAccountId },
        include: {
          connectedRecipientService: {
            include: {
              user: true
            }
          }
        }
      })
      if (!account) return null

      return {
        ...account.connectedRecipientService.user,
        email: account?.connectedRecipientService?.serviceValue,
        emailVerified: account?.connectedRecipientService.createdAt
      }
    },
    deleteUser: async (id) => {
      const user = await p.user.delete({ where: { id }, include: { recipientServices: true } })
      if (!user) return null
      return {
        ...user,
        email: user.recipientServices[0].serviceValue,
        emailVerified: user.recipientServices[0].createdAt
      }
    },
    linkAccount: async (data) => {
      console.log('link account', data)
      return p.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: data.provider,
            providerAccountId: data.providerAccountId
          }
        }
      }) as unknown as AdapterAccount
    },
    unlinkAccount: (provider_providerAccountId) =>
      p.account.delete({
        where: { provider_providerAccountId }
      }) as unknown as AdapterAccount,
    async getAccount(providerAccountId, provider) {
      return p.account.findFirst({
        where: { providerAccountId, provider }
      }) as Promise<AdapterAccount | null>
    }
  }
}

export async function linkAccount(data: Account, userId: string, emailId: string) {
  const userRecipientService = await prisma.userRecipientService.upsert({
    where: { userId: userId, type_serviceValue: { type: 'EMAIL', serviceValue: emailId } },
    create: {
      type: 'EMAIL',
      serviceValue: emailId,
      connectedByAccount: {
        create: {
          provider: data.provider,
          providerAccountId: data.providerAccountId,
          type: data.type,
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          token_type: data.token_type,
          scope: data.scope,
          expires_at: data.expires_at,
          id_token: data.id_token,
          session_state: data.session_state?.toString()
        }
      },
      userId: userId
    },
    update: {
      connectedByAccount: {
        connectOrCreate: {
          where: {
            provider_providerAccountId: {
              provider: data.provider,
              providerAccountId: data.providerAccountId
            }
          },
          create: {
            provider: data.provider,
            providerAccountId: data.providerAccountId,
            type: data.type,
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            token_type: data.token_type,
            scope: data.scope,
            expires_at: data.expires_at,
            id_token: data.id_token,
            session_state: data.session_state?.toString()
          }
        }
      }
    },
    include: {
      connectedByAccount: {
        where: {
          provider: data.provider,
          providerAccountId: data.providerAccountId
        }
      }
    }
  })
  return userRecipientService.connectedByAccount[0] as unknown as AdapterAccount
}

export async function createAccount(data: { name?: string | null; image?: string | null; userName: string }) {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      image: data.image,
      userName: data.userName
    },
    include: {
      recipientServices: {
        where: {
          type: 'EMAIL'
        }
      }
    }
  })
  return {
    ...user,
    email: user.recipientServices[0]?.serviceValue,
    emailVerified: user.recipientServices[0]?.createdAt
  }
}
