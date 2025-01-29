'use client'
import { useContactStore } from '@/store/contacts'
import { Drawer } from '@mantine/core'
import React from 'react'
import ContactCard from './ContactCard'
import AddNewContact from './AddNewContact'

const ContactSidePanal = ({ opened, close }: { opened: boolean; close: () => void }) => {
  const { contacts } = useContactStore((state) => state)

  return (
    <Drawer title={'Contacts'} opened={opened} onClose={close} position='right'>
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
      <AddNewContact />
    </Drawer>
  )
}

export default ContactSidePanal
