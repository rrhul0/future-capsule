'use client'
import { signout } from '@/app/api/server-actions/signout'
import React from 'react'

const SignoutButton = () => {
  return <button onClick={signout}>Signout</button>
}

export default SignoutButton
