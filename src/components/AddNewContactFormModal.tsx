import { addUsersToContactsList, searchUserWithUserName } from '@/app/server-actions/users'
import { Button, Modal, Popover, TextInput } from '@mantine/core'
import React from 'react'
import ContactCard from './ContactCard'
import { useDisclosure } from '@mantine/hooks'
import { useSession } from 'next-auth/react'
import { useContactStore } from '@/store/contacts'

export type UserType = {
  id: string
  userName: string
  name: string | null
}

const AddNewContactFormModal = ({ opened, close }: { opened: boolean; close: () => void }) => {
  const [openedDropdown, { open: openDropdown, close: closeDropdown }] = useDisclosure(false)
  const session = useSession()
  const { addNewContacts } = useContactStore((state) => state)

  const [searchResults, setSearchResults] = React.useState<UserType[]>([])
  const [selectedUsers, setSelectedUsers] = React.useState<UserType[]>([])
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null)
  const searchInputRef = React.useRef<HTMLInputElement | null>(null)

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value

    if (!search) {
      setSearchResults([])
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
      return
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(async () => {
      const searchResult = await searchUserWithUserName(search.replaceAll(/\s/g, ''))
      setSearchResults(searchResult)
      if (searchResult) openDropdown()
    }, 1000)
  }

  return (
    <Modal
      title='Add New Contact'
      opened={opened}
      onClose={() => {
        close()
        setSearchResults([])
        setSelectedUsers([])
      }}
    >
      <TextInput
        type='text'
        ref={searchInputRef}
        placeholder='Search'
        onChange={onChangeSearch}
        onFocus={(e) => {
          if (e.currentTarget.value === '') return
          openDropdown()
        }}
        onBlur={closeDropdown}
      />
      <Popover
        width={408}
        position={'top'}
        styles={{
          dropdown: {
            // top: '50%',
            left: '50%',
            transform: 'translate(-50%, 0)'
          }
        }}
        shadow='md'
        opened={openedDropdown}
      >
        <Popover.Dropdown>
          {searchResults.length ? (
            searchResults.map((user) => (
              <ContactCard
                contact={user}
                key={user.userName}
                onClick={() => {
                  if (user.userName === session.data?.user?.userName) return
                  if (selectedUsers.find((u) => u.userName === user.userName)) return
                  setSelectedUsers([...selectedUsers, user])
                  searchInputRef.current?.blur()
                }}
              />
            ))
          ) : (
            <div>No contacts found!</div>
          )}
        </Popover.Dropdown>
      </Popover>
      {selectedUsers.map((user) => (
        <ContactCard
          contact={user}
          key={user.userName}
          showDelete
          onClickDelete={() => {
            setSelectedUsers(selectedUsers.filter((u) => u.userName !== user.userName))
          }}
        />
      ))}
      <Button
        variant='gradient'
        disabled={!selectedUsers.length}
        onClick={async () => {
          try {
            await addUsersToContactsList(selectedUsers.map((u) => u.userName))
          } catch {
            return
          }
          addNewContacts(selectedUsers)
        }}
      >
        Add to contact list
      </Button>
    </Modal>
  )
}

export default AddNewContactFormModal
