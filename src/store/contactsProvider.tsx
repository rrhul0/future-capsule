'use client'
import { ReactNode, useRef } from 'react'
import { ContactsStoreApi, ContactsStoreContext, ContactType, createContactStore } from './contacts'

export interface ContactsStoreProviderProps {
  children: ReactNode
  contacts: ContactType[]
}

export const ContactsStoreProvider = ({ children, contacts }: ContactsStoreProviderProps) => {
  const storeRef = useRef<ContactsStoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createContactStore({
      contacts,
      error: null,
      isLoading: false
    })
  }

  return <ContactsStoreContext.Provider value={storeRef.current}>{children}</ContactsStoreContext.Provider>
}
