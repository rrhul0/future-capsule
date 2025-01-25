import CreateCapsule from '@/components/createCapsuleModel'
import SignoutButton from '@/components/signoutButton'
import React from 'react'

const Page = async () => {
  return (
    <div>
      <SignoutButton />
      <h1>Dashboard Page</h1>
      <CreateCapsule />
    </div>
  )
}

export default Page
