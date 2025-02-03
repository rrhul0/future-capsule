import { getCapsulesConfiguration, getUserProfile } from '@/app/server-actions/userProfile'
import CapsulesConfiguration from '@/components/settings/CapsulesConfiguration'
import { getQueryClient } from '@/utils/reactQuery'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import React from 'react'
import ProfileConfiguration from '@/components/settings/ProfileCofiguration'

const GeneralPage = () => {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: ['userData', { type: 'profile' }],
    queryFn: () => getUserProfile()
  })
  queryClient.prefetchQuery({
    queryKey: ['userData', { type: 'capsules' }],
    queryFn: () => getCapsulesConfiguration()
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <ProfileConfiguration />
        <CapsulesConfiguration />
      </div>
    </HydrationBoundary>
  )
}

export default GeneralPage
