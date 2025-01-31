'use client'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ReactNode } from 'react'

const SideNavLink = ({ children, ...props }: LinkProps & { children: ReactNode }) => {
  const pathName = usePathname()
  return (
    <Link {...props} className={pathName === props.href ? 'text-red-500' : ''}>
      {children}
    </Link>
  )
}

export default SideNavLink
