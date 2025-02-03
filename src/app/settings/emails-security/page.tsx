import { getUserRecipients } from '@/app/server-actions/userProfile'
import ConnectAnotherAccount from '@/components/settings/ConnectAnotherAccount'
import RecipientServicesList from '@/components/settings/RecipientServicesList'
import { getQueryClient } from '@/utils/reactQuery'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

const RecipientServices = () => {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: ['userData', { type: 'recipients' }],
    queryFn: () => getUserRecipients()
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <ConnectAnotherAccount />
        <RecipientServicesList />
      </div>
    </HydrationBoundary>
  )
}

export default RecipientServices
