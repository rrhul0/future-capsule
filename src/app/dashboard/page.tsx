import CapsulesGrid from '@/components/capsulesGrid'
import CreateCapsule from '@/components/createCapsule'
import SignoutButton from '@/components/signoutButton'
import React from 'react'

const Page = () => {
  return (
    <div>
      <SignoutButton />
      <h1>Dashboard Page</h1>
      <CreateCapsule />
      <CapsulesGrid />
    </div>
  )
}

export default Page
