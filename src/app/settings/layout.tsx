import Sidenav from '@/components/settings/Sidenav'
import React, { ReactNode } from 'react'

const ProfileLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex gap-4'>
      <Sidenav />
      {children}
    </div>
  )
}

export default ProfileLayout
