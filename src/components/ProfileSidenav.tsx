import Link from 'next/link'
import React from 'react'

const ProfileSidenav = () => {
  return (
    <div className='sidenav'>
      <h2>Profile</h2>
      <ul>
        <li>
          <Link href='/profile'>General</Link>
        </li>
        <li>
          <Link href='/profile/user-interface'>User interface/themes</Link>
        </li>
        <li>
          <Link href='/profile/recipient-services'>Recipient services</Link>
        </li>
        <li>
          <Link href='/profile/connected-users'>Connected users</Link>
        </li>
      </ul>
    </div>
  )
}

export default ProfileSidenav
