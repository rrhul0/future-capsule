import React from 'react'
import AllNotifications from './AllNotifications'
import Link from 'next/link'
import { auth } from '@/auth'
import SignoutButton from './signoutButton'

const Header = async () => {
  const session = await auth()
  return (
    <header className='flex w-full justify-between items-center p-4'>
      <div>
        {/* LOGO will be here*/}
        <Link href='/'>Future capsule home</Link>
      </div>
      <div className='flex gap-4'>
        <AllNotifications />
        <Link href='/settings'>Settings</Link>
        {session && session.user && session.user.id ? <SignoutButton /> : <Link href={'/auth/signin'}>Signin</Link>}
      </div>
    </header>
  )
}

export default Header
