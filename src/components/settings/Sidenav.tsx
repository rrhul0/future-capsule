import Link from 'next/link'
import React from 'react'

const SettingsSidenav = () => {
  return (
    <div className='sidenav basis-1/4 shrink-0'>
      <h2>Profile</h2>
      <ul>
        <li>
          <Link href='/settings/profile'>General</Link>
        </li>
        <li>
          <Link href='/settings/appearance'>Appearance</Link>
        </li>
        <li>
          <Link href='/settings/recipient-services'>Recipient services</Link>
        </li>
        <li>
          <Link href='/settings/connected-users'>Connected users</Link>
        </li>
      </ul>
    </div>
  )
}

export default SettingsSidenav
