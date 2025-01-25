'use client'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, Textarea, Flex, MultiSelect } from '@mantine/core'
import { Plus } from '@phosphor-icons/react'
import { createCapsuleAction } from '@/app/server-actions/capsule'
import { DateInput, TimeInput } from '@mantine/dates'
import { useState } from 'react'

function CreateCapsule() {
  const [opened, { open, close }] = useDisclosure(false)
  const [emails, setEmails] = useState<string[]>([])
  const [multiSelectData, setMultiSelectData] = useState<string[]>()
  const [message, setMessage] = useState('')

  const onChangeSearch = (value: string) => {
    if (!value) setMultiSelectData(emails)
    else setMultiSelectData([...emails, value])
  }

  return (
    <>
      <Modal opened={opened} onClose={close} title='Create new future capsule'>
        <form action={(data) => createCapsuleAction(data).then(close)} method='post'>
          <MultiSelect
            data={multiSelectData}
            value={emails}
            onChange={(values) => {
              if (values.at(-1)?.match(/^[^@]+@[^@]+\.[^@]+$/)) {
                setEmails(values)
                setMultiSelectData(values)
              }
            }}
            searchable
            onRemove={(value) => {
              setEmails(emails.filter((email) => email !== value))
            }}
            onSearchChange={onChangeSearch}
            name='emails'
          />
          <Textarea
            label='Capsule message'
            name='message'
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
          />
          <Flex>
            <DateInput
              label='Open date'
              name='openDate'
              minDate={new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000)}
              className='basis-3/4'
            />
            <TimeInput
              label='Open time'
              name='openTime'
              defaultValue={'10:00'}
              onClick={(e) => e.currentTarget.showPicker()}
              className='cursor-pointer basis-1/4'
            />
          </Flex>
          <Button type='submit'>Create</Button>
        </form>
      </Modal>

      <Button variant='default' onClick={open}>
        Capsule <Plus size={32} />
      </Button>
    </>
  )
}

export default CreateCapsule
