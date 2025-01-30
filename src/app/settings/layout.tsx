import Sidenav from '@/components/settings/Sidenav'
import React, { ReactNode } from 'react'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/utils/reactQuery'
import { getUserData } from '../server-actions/userProfile'

const ProfileLayout = async ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: ['userData'],
    queryFn: () => getUserData()
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='flex gap-4'>
        <Sidenav />
        {children}
      </div>
    </HydrationBoundary>
  )
}

export default ProfileLayout
