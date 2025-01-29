'use client'
import { Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React from 'react'
import ContactSidePanal from './ContactSidePanal'

const ShowContactsButton = ({ title = 'Show contacts' }: { title?: string }) => {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Button variant='default' onClick={open}>
        {title}
      </Button>
      <ContactSidePanal opened={opened} close={close} />
    </>
  )
}

export default ShowContactsButton
