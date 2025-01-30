import ProfileSidenav from '@/components/ProfileSidenav'
import React, { ReactNode } from 'react'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/utils/reactQuery'
import { getUserData } from '../server-actions/user'

const ProfileLayout = async ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: ['userData'],
    queryFn: () => getUserData()
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <ProfileSidenav />
        {children}
      </div>
    </HydrationBoundary>
  )
}

export default ProfileLayout
