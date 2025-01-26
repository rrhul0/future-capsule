import { Modal, Button, Textarea, Flex, MultiSelect } from '@mantine/core'
import { createCapsuleAction } from '@/app/server-actions/capsule'
import { DateInput, DateValue, TimeInput } from '@mantine/dates'
import { useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(duration)

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
      const openDatems = dayjs.tz(date.toISOString()).tz('UTC')
      const diffInDays = openDatems.diff(dayjs().add(5, 'minutes'), 'day', true) // get diff in days from now (+ 5 mins)
      const minTime = 0 < diffInDays && diffInDays < 1 ? dayjs.duration(1 - diffInDays, 'day') : undefined

      setMinTime(minTime?.format('HH:mm'))
      if (minTime) setOpenTime(minTime.format('HH:mm'))
    }
  }

  const action = () => {
    if (openDate && openTime && emails.length && message) {
      const date = dayjs(openDate).tz('UTC').format('YYYY-MM-DD')
      const openTimeStamp = dayjs.tz(`${date} ${openTime}`).tz('UTC').format('YYYY-MM-DDTHH:mm:ss')
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
