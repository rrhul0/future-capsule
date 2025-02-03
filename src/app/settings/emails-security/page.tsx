import { getUserRecipients } from '@/app/server-actions/userProfile'
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
      <RecipientServicesList />
    </HydrationBoundary>
  )
}

export default RecipientServices
