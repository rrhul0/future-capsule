import { Modal, Button, Textarea, Flex, MultiSelect } from '@mantine/core'
import { createCapsuleAction } from '@/app/server-actions/capsule'
import { DateInput, DateValue, TimeInput } from '@mantine/dates'
import { useState } from 'react'

const CreateCapsuleModal = ({ opened, close }: { opened: boolean; close: () => void }) => {
  const [emails, setEmails] = useState<string[]>([])
  const [multiSelectData, setMultiSelectData] = useState<string[]>()
  const [message, setMessage] = useState('')
  const [openDate, setOpenDate] = useState<DateValue>()
  const [minTime, setMinTime] = useState<string | undefined>(undefined)
  const [openTime, setOpenTime] = useState<string>(minTime || '10:00')

  const onChangeSearch = (value: string) => {
    if (!value) setMultiSelectData(emails)
    else setMultiSelectData([...emails, value])
  }

  const onDateChange = (date: DateValue) => {
    setOpenDate(date)

    const minTime =
      date &&
      new Date(date).getTime() - new Date().getTime() > 0 &&
      new Date(date).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000
        ? new Date(24 * 60 * 60 * 1000 - new Date(date).getTime() + new Date().getTime() + 5 * 60 * 1000)
            .toISOString()
            .slice(11, 16)
        : undefined
    setMinTime(minTime)

    if (minTime) setOpenTime(minTime)
  }

  return (
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
            className='basis-2/3'
            value={openDate}
            onChange={onDateChange}
          />
          <TimeInput
            label='Open time'
            name='openTime'
            minTime={minTime}
            value={openTime}
            onChange={(e) => setOpenTime(e.currentTarget.value)}
            onClick={(e) => e.currentTarget.showPicker()}
            className='cursor-pointer basis-1/3'
          />
        </Flex>
        <Button type='submit'>Create</Button>
      </form>
    </Modal>
  )
}

export default CreateCapsuleModal
