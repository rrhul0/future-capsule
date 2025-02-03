import React from 'react'
import SideNavLink from './SideNavLink'

const SettingsSidenav = () => {
  return (
    <div className='sidenav basis-1/4 shrink-0'>
      <h2>Profile</h2>
      <ul>
        <li>
          <SideNavLink href='/settings/profile'>General</SideNavLink>
        </li>
        <li>
          <SideNavLink href='/settings/appearance'>Appearance</SideNavLink>
        </li>
        <li>
          <SideNavLink href='/settings/emails-security'>Recipient services</SideNavLink>
        </li>
        <li>
          <SideNavLink href='/settings/contacts'>Connected users</SideNavLink>
        </li>
      </ul>
    </div>
  )
}

export default SettingsSidenav
