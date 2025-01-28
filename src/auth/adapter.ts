import { type PrismaClient } from '@prisma/client'
import type { Adapter, AdapterAccount } from '@auth/core/adapters'

export function PrismaAdapter(prisma: PrismaClient | ReturnType<PrismaClient['$extends']>): Adapter {
  const p = prisma as PrismaClient
  return {
    createUser: async (data) => {
      const user = await p.user.create({
        data: {
          name: data.name,
          image: data.image,
          userName: data.userName,
          recipientServices: {
            create: {
              type: 'EMAIL',
              serviceValue: data.email
            }
          }
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
        email: user.recipientServices[0].serviceValue,
        emailVerified: user.recipientServices[0].createdAt
      }
    },
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
          user: {
            include: {
              recipientServices: true
            }
          }
        }
      })
      if (!account) return null

      return {
        ...account?.user,
        email: account?.user.recipientServices[0]?.serviceValue,
        emailVerified: account?.user.recipientServices[0]?.createdAt
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
    linkAccount: (data) => p.account.create({ data }) as unknown as AdapterAccount,
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
