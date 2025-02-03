import { Modal, Button, Textarea, Flex } from '@mantine/core'
import { CapsuleData, createCapsuleAction } from '@/app/server-actions/capsule'
import { DateInput, DateValue, TimeInput } from '@mantine/dates'
import { useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import { useForm } from '@mantine/form'
import { useQueryClient } from '@tanstack/react-query'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(duration)

type FormvaluesType = {
  message: string
  openDate?: DateValue
  openTime?: string
}

const CreateCapsuleModal = ({ opened, close }: { opened: boolean; close: () => void }) => {
  const form = useForm<FormvaluesType>({
    mode: 'uncontrolled',
    initialValues: {
      message: '',
      openTime: '10:00'
    },
    validate: {
      message: (value) => (value ? null : 'Message is required'),
      openDate: (value) => (value ? null : 'Open date is required'),
      openTime: (value) => (value ? null : 'Open time is required')
    }
  })

  const queryClient = useQueryClient()

  const [minTime, setMinTime] = useState<string | undefined>(undefined)

  const onDateChange = (date: DateValue) => {
    form.setValues({ openDate: date })
    if (date) {
      const openDatems = dayjs.tz(date.toISOString()).tz('UTC')
      const diffInDays = openDatems.diff(dayjs().add(5, 'minutes'), 'day', true) // get diff in days from now (+ 5 mins)
      const minTimeDuration = 0 < diffInDays && diffInDays < 1 ? dayjs.duration(1 - diffInDays, 'day') : undefined

      setMinTime(minTimeDuration?.format('HH:mm'))
      if (minTimeDuration) {
        form.setValues({ openTime: minTimeDuration.format('HH:mm') })
      }
    }
  }

  const action = async () => {
    form.validate()
    if (form.isValid()) {
      const { openDate, openTime, message } = form.getValues()
      const date = dayjs(openDate).tz('UTC').format('YYYY-MM-DD')
      const openTimeStamp = dayjs.tz(`${date} ${openTime}`).tz('UTC').format('YYYY-MM-DDTHH:mm:ss')
      const newCapsule = await createCapsuleAction({ message, timestamp: openTimeStamp })
      queryClient.setQueryData(['capsules'], (oldCapsules: CapsuleData[]) => [newCapsule, ...oldCapsules])
      close()
    }
  }

  return (
    <Modal opened={opened} onClose={close} title='Create new future capsule'>
      <form action={action}>
        <Textarea label='Capsule message' name='message' {...form.getInputProps('message')} />
        <input type='hidden' name='tzOffset' defaultValue={new Date().getTimezoneOffset().toString()} />
        <Flex gap={10}>
          <DateInput
            label='Open date'
            name='openDate'
            minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
            className='basis-2/3'
            {...form.getInputProps('openDate')}
            onChange={onDateChange}
          />
          <TimeInput
            label='Open time'
            name='openTime'
            minTime={minTime}
            {...form.getInputProps('openTime')}
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
