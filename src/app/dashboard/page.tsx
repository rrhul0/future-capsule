import CapsulesGrid from '@/components/capsulesGrid'
import CreateCapsule from '@/components/createCapsule'
import ShowContactsButton from '@/components/ShowContactsButton'
import { getQueryClient } from '@/utils/reactQuery'
import React, { Suspense } from 'react'
import { getContacts } from '../server-actions/userProfile'
import { getAllCapsules } from '../server-actions/capsule'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

const Page = async () => {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: ['contacts'],
    queryFn: () => getContacts()
  })

  queryClient.prefetchQuery({
    queryKey: ['capsules'],
    queryFn: () => getAllCapsules()
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <h1>Dashboard Page</h1>
        <ShowContactsButton />
        <CreateCapsule />
        <Suspense fallback={<div>Loading Capsules...</div>}>
          <CapsulesGrid />
        </Suspense>
      </div>
    </HydrationBoundary>
  )
}

export default Page
