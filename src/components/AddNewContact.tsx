'use client'
import { Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React from 'react'
import AddNewContactFormModal from './AddNewContactFormModal'

const AddNewContact = () => {
  const [opened, { open, close }] = useDisclosure(false)
  return (
    <>
      <Button variant='default' onClick={open}>
        Add another contact
      </Button>
      <AddNewContactFormModal opened={opened} close={close} />
    </>
  )
}

export default AddNewContact
