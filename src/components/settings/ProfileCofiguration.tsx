'use client'
import { getUserProfile, updateUserProfile } from '@/app/server-actions/userProfile'
import { TextInput, Button } from '@mantine/core'
import { hasLength, useForm } from '@mantine/form'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'

const ProfileConfiguration = () => {
  const { data: userProfileData } = useSuspenseQuery({
    queryKey: ['userData', { type: 'profile' }],
    queryFn: () => getUserProfile()
  })
  const queryClient = useQueryClient()
  const form = useForm<UserProfileType>({
    mode: 'uncontrolled',
    initialValues: userProfileData,
    validate: {
      name: hasLength({ min: 3 }, 'Must be at least 3 characters'),
      userName: hasLength({ min: 3 }, 'Must be at least 3 characters'),
      image: hasLength({ min: 3 }, 'Must be at least 3 characters')
    }
  })

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess(data) {
      queryClient.setQueryData(['userData', { type: 'profile' }], data)
    }
  })

  return (
    <form onSubmit={form.onSubmit((e) => mutation.mutate(e))} className='w-full'>
      <TextInput {...form.getInputProps('name')} key={form.key('name')} label='Name' placeholder='Name' />
      <TextInput
        {...form.getInputProps('userName')}
        key={form.key('userName')}
        mt='md'
        label='Username'
        placeholder='Username'
      />
      <TextInput
        {...form.getInputProps('image')}
        key={form.key('image')}
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

export default ProfileConfiguration
