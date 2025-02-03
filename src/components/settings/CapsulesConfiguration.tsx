'use client'
import { getCapsulesConfiguration, updateCapsulesConfiguration } from '@/app/server-actions/userProfile'
import { TextInput, Button } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useSuspenseQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import React from 'react'

const CapsulesConfiguration = () => {
  const { data: userCapsulesConfiguration } = useSuspenseQuery({
    queryKey: ['userData', { type: 'capsules' }],
    queryFn: () => getCapsulesConfiguration()
  })
  const queryClient = useQueryClient()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: userCapsulesConfiguration
  })

  const mutation = useMutation({
    mutationFn: updateCapsulesConfiguration,
    onSuccess(data) {
      queryClient.setQueryData(['userData', { type: 'capsules' }], data)
    }
  })

  return (
    <form onSubmit={form.onSubmit((e) => mutation.mutate(e))} className='w-full'>
      <TextInput
        {...form.getInputProps('minCapsuleDelay')}
        key={form.key('minCapsuleDelay')}
        mt='md'
        label='Minimum Capsules delay'
        description='Minium how much future you can create a capsule (in minutes)'
        placeholder='Minutes'
      />
      <TextInput
        {...form.getInputProps('maxCapsuleDelay')}
        key={form.key('maxCapsuleDelay')}
        mt='md'
        label='Maximum Capsules delay'
        description='How much future you can create a capsule (in minutes), 0 for no limit'
        placeholder='Minutes'
      />
      <Button type='submit' mt='md'>
        Update capsules profile
      </Button>
    </form>
  )
}

export default CapsulesConfiguration
