'use client'
import { getUserData, updateAccountInformation } from '@/app/server-actions/userProfile'
import { TextInput, Button } from '@mantine/core'
import { hasLength, useForm } from '@mantine/form'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'

export type AccountInformationFormValuesType = {
  name?: string | null
  userName?: string
  avatarUrl?: string | null
  // nickname?: string
}

const AccountInformation = () => {
  const { data: userData } = useSuspenseQuery({
    queryKey: ['userData'],
    queryFn: () => getUserData()
  })
  const form = useForm<AccountInformationFormValuesType>({
    mode: 'uncontrolled',
    initialValues: {
      name: userData?.name,
      userName: userData?.userName,
      avatarUrl: userData?.image
      // nickname: userData?.nickname
    },
    validate: {
      name: hasLength({ min: 3 }, 'Must be at least 3 characters'),
      userName: hasLength({ min: 3 }, 'Must be at least 3 characters'),
      avatarUrl: hasLength({ min: 3 }, 'Must be at least 3 characters')
    }
  })

  return (
    <form onSubmit={form.onSubmit(updateAccountInformation)} className='w-full'>
      <TextInput {...form.getInputProps('name')} key={form.key('name')} label='Name' placeholder='Name' />
      <TextInput
        {...form.getInputProps('userName')}
        key={form.key('userName')}
        mt='md'
        label='Username'
        placeholder='Username'
      />
      <TextInput
        {...form.getInputProps('avatarUrl')}
        key={form.key('avatarUrl')}
        mt='md'
        label='Avatar URL'
        placeholder='Avatar URL'
      />
      <Button type='submit' mt='md'>
        Update profile
      </Button>
    </form>
  )
}

export default AccountInformation
