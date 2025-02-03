'use client'
import { disconnectAccount, disconnectRecipient, getUserRecipients } from '@/app/server-actions/userProfile'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'

const RecipientServicesList = () => {
  const queryClient = useQueryClient()

  const { data: userRecipientServices } = useSuspenseQuery({
    queryKey: ['userData', { type: 'recipients' }],
    queryFn: () => getUserRecipients()
  })

  const onDisconnectRecipient = async (serviceId: string) => {
    const newRecipientsList = await disconnectRecipient(serviceId)
    queryClient.setQueryData(['userData', { type: 'recipients' }], newRecipientsList)
  }

  const onDisconnectAccount = async (serviceId: string, accountId: string, provider: string) => {
    const newRecipientsList = await disconnectAccount(serviceId, accountId, provider)
    queryClient.setQueryData(['userData', { type: 'recipients' }], newRecipientsList)
  }

  return (
    <div>
      {userRecipientServices.map((service) => (
        <div key={service.id}>
          <div>{service.serviceValue}</div>
          <button onClick={() => onDisconnectRecipient(service.id)}>Disconnect</button>
          {service.type === 'EMAIL' &&
            service.connectedByAccount.map((acc) => (
              <div key={acc.providerAccountId + acc.provider}>
                <div>{acc.provider}</div>
                <button onClick={() => onDisconnectAccount(service.id, acc.providerAccountId, acc.provider)}>
                  Disconnect
                </button>
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}

export default RecipientServicesList
