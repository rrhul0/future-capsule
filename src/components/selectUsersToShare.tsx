'use client'
import { Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React from 'react'

import { useContactStore } from '@/store/contacts'

const SelectUsersToShare = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const { contacts } = useContactStore((state) => state)

  return (
    <div>
      <Button variant='default' onClick={open}>
        Select users to share
      </Button>
      <Modal title='Select Users to Share' opened={opened} onClose={close}>
        {/* show current user's contact list*/}
        {contacts.map((contact) => (
          <div key={contact.id}>
            <p>{contact.name}</p>
            <p>{contact.userName}</p>
          </div>
        ))}
      </Modal>
    </div>
  )
}

export default SelectUsersToShare
