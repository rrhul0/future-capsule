import { Button } from '@mantine/core'
import { Trash } from '@phosphor-icons/react'
import React from 'react'
import { UserType } from './AddNewContactFormModal'

const ContactCard = ({
  contact,
  showDelete = false,
  onClickDelete,
  onClick
}: {
  contact: UserType
  showDelete?: boolean
  onClickDelete?: () => void
  onClick?: () => void
}) => {
  return (
    <div role={onClick ? 'button' : undefined} onClick={onClick} className='border rounded-lg p-2'>
      <div>{contact.name}</div>
      <div>{contact.userName}</div>
      {showDelete && (
        <Button variant='filled' color='red' onClick={onClickDelete}>
          <Trash />
        </Button>
      )}
    </div>
  )
}

export default ContactCard
