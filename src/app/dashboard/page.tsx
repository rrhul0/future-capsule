import CapsulesGrid from '@/components/capsulesGrid'
import CreateCapsule from '@/components/createCapsule'
import SignoutButton from '@/components/signoutButton'
import getUser from '@/lib/getUser'
import React from 'react'

const Page = async () => {
  const user = await getUser()
  return (
    <div>
      <SignoutButton />
      <h1>Dashboard Page</h1>
      <h1>
        Welcome {user.name} <span className='text-blue-600 italic'>@{user.userName}</span>
      </h1>
      <p>{user.email}</p>
      <CreateCapsule />
      <CapsulesGrid />
    </div>
  )
}

export default Page
