// stores/contactStore.js
import { createContext, useContext } from 'react'
import { createStore, useStore } from 'zustand'

export type ContactType = {
  id: string
  userName: string | null
  name: string | null
}

type ContactsState = {
  contacts: ContactType[]
  isLoading: boolean
  error: string | null
}

type ContactsActions = {
  setContacts: (contacts: ContactType[]) => void
  fetchContacts: () => Promise<void>
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
    fetchContacts: async () => {
      set({ isLoading: true, error: null })
      try {
        const response = await fetch('/api/contacts') // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch contacts')
        }
        const data = await response.json()
        set({ contacts: data, isLoading: false })
      } catch {
        set({ error: 'Something went wrong', isLoading: false })
      }
    }
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
