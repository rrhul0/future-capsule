'use client'
import { Drawer } from '@mantine/core'
import React from 'react'
import ContactCard from './ContactCard'
import AddNewContact from './AddNewContact'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getContacts } from '@/app/server-actions/userProfile'

const ContactSidePanal = ({ opened, close }: { opened: boolean; close: () => void }) => {
  const { data: contacts } = useSuspenseQuery({
    queryKey: ['contacts'],
    queryFn: () => getContacts()
  })

  return (
    <Drawer title={'Contacts'} opened={opened} onClose={close} position='bottom'>
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
      <AddNewContact />
    </Drawer>
  )
}

export default ContactSidePanal
