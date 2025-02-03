'use client'
import { useDisclosure } from '@mantine/hooks'
import React from 'react'
import ContactSidePanal from './ContactSidePanal'
import { ArrowFatLineUp } from '@phosphor-icons/react'

const ShowContactsButton = ({ title = 'Show contacts' }: { title?: string }) => {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <div className='absolute bottom-0 right-0 rounded-tl-lg rounded-tr-lg bg-black py-3 px-6'>
      <button onClick={open} className='flex items-center gap-3'>
        <ArrowFatLineUp weight='fill' />
        {title}
      </button>
      <ContactSidePanal opened={opened} close={close} />
    </div>
  )
}

export default ShowContactsButton
