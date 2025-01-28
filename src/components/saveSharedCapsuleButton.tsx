'use client'
import { acceptLinkSharedCapsule } from '@/app/server-actions/capsule'
import { Button } from '@mantine/core'
import { useRouter } from 'next/navigation'
import React from 'react'

const SaveSharedCapsuleButton = (data: { id: string; userId?: string }) => {
  const router = useRouter()
  const onClickSave = async () => {
    const res = await acceptLinkSharedCapsule(data)
    if (Array.isArray(res) && res[0].status === 'success') router.push('/dashboard')
  }

  return (
    <Button variant='default' onClick={onClickSave}>
      Save this Capsule to your account
    </Button>
  )
}

export default SaveSharedCapsuleButton
