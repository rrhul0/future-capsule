import { createContext, useContext } from 'react'
import { createStore, useStore } from 'zustand'

export type ContactType = {
  id: string
  userName: string
  name: string | null
}

type ContactsState = {
  contacts: ContactType[]
  isLoading: boolean
  error: string | null
}

type ContactsActions = {
  setContacts: (contacts: ContactType[]) => void
  addNewContacts: (contact: ContactType[]) => void
}

type ContactsStore = ContactsState & ContactsActions

export const defaultContactsInitState: ContactsState = {
  contacts: [],
  error: null,
  isLoading: false
}

export const createContactStore = (initState: ContactsState = defaultContactsInitState) =>
  createStore<ContactsStore>((set) => ({
    ...initState,
    setContacts: (contacts) => set({ contacts }),
    addNewContacts: (newContacts) =>
      set(({ contacts }) => ({
        contacts: [...contacts, ...newContacts]
      }))
  }))

export type ContactsStoreApi = ReturnType<typeof createContactStore>

export const ContactsStoreContext = createContext<ContactsStoreApi | undefined>(undefined)

export const useContactStore = <T>(selector: (store: ContactsStore) => T): T => {
  const contactsStoreContext = useContext(ContactsStoreContext)

  if (!contactsStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`)
  }

  return useStore(contactsStoreContext, selector)
}
