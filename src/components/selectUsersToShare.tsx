'use client'
import { Button, Checkbox, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React from 'react'
import { useContactStore } from '@/store/contacts'
import { shareCapsule } from '@/app/server-actions/capsule'
import { toast } from 'react-toastify'

const SelectUsersToShare = ({ capsuleId }: { capsuleId: string }) => {
  const [opened, { open, close }] = useDisclosure(false)
  const { contacts } = useContactStore((state) => state)

  const onSubmitForm = (formData: FormData) => {
    toast.promise(shareCapsule({ capsuleId, userIds: (formData.getAll('usersToShare') as string[]) ?? [] }), {
      pending: 'Sharing Capsule to users',
      error: 'Something went wrong',
      success: {
        render({ data }) {
          if (Array.isArray(data))
            return data.map((r) => contacts.find((c) => c.id === r.userId)?.name + ' ' + r.status).join('\n')
          return data.status === 'failed' ? (
            <div className='text-red-600 font-semibold'>{data.error}</div>
          ) : (
            'Capsule shared successfully'
          )
        }
      }
    })
  }

  return (
    <div>
      <Button variant='default' onClick={open}>
        Select users to share
      </Button>
      <Modal title='Select Users to Share' opened={opened} onClose={close}>
        {/* show current user's contact list*/}
        <form action={onSubmitForm}>
          {contacts.map((contact) => (
            <div key={contact.id}>
              <Checkbox value={contact.id} name='usersToShare' label={contact.name} description={contact.userName} />
            </div>
          ))}
          <Button variant='default' type='submit'>
            Share
          </Button>
        </form>
      </Modal>
    </div>
  )
}

export default SelectUsersToShare
