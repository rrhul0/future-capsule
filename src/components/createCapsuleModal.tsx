import { Modal, Button, Textarea, Flex, MultiSelect } from '@mantine/core'
import { createCapsuleAction } from '@/app/server-actions/capsule'
import { DateInput, DateValue, TimeInput } from '@mantine/dates'
import { useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

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
    if (date) {
      const tzOffset = new Date().getTimezoneOffset()
      const openDatems = new Date(date).getTime() + tzOffset * 60 * 1000
      const currentTimems = Date.now()
      const diff = openDatems - currentTimems

      const minTime =
        0 < diff && diff < 24 * 60 * 60 * 1000 // match diff to 24 hours
          ? new Date(24 * 60 * 60 * 1000 - diff + 5 * 60 * 1000).toISOString().slice(11, 16) // also add a 5 min offset
          : undefined
      setMinTime(minTime)
      if (minTime) setOpenTime(minTime)
    }
  }

  const action = () => {
    if (openDate && openTime && emails.length && message) {
      const date = dayjs(openDate).tz('UTC').format('YYYY-MM-DD')
      const openTimeStamp = dayjs
        .tz(`${date} ${openTime}`, Intl.DateTimeFormat().resolvedOptions().timeZone)
        .tz('UTC')
        .format('YYYY-MM-DDTHH:mm:ss')
      createCapsuleAction({ emails, message, timestamp: openTimeStamp }).then(close)
    }
  }

  return (
    <Modal opened={opened} onClose={close} title='Create new future capsule'>
      <form action={action} method='post'>
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
        <input type='hidden' name='tzOffset' defaultValue={new Date().getTimezoneOffset().toString()} />
        <Flex>
          <DateInput
            label='Open date'
            name='openDate'
            minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
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
