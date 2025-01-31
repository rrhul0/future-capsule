import React from 'react'
import AllNotifications from './AllNotifications'
import Link from 'next/link'

const Header = () => {
  return (
    <header>
      <AllNotifications />
      <Link href='/settings'>Settings</Link>
    </header>
  )
}

export default Header
