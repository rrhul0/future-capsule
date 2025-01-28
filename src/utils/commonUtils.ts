import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export const getTimeLeft = (toDate: Date) => {
  const now = dayjs()

  const diff = dayjs(toDate).diff(now) // Get the difference in milliseconds
  const durationLeft = dayjs.duration(diff)

  const years = durationLeft.years()
  const months = durationLeft.months()
  const days = durationLeft.days()
  const hours = durationLeft.hours()
  const minutes = durationLeft.minutes()

  const timeLeft = [
    years > 0 ? `${years} ${years === 1 ? 'year' : 'years'}` : null,
    months > 0 ? `${months} ${months === 1 ? 'month' : 'months'}` : null,
    days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}` : null,
    hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : null,
    minutes > 0 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : null
  ]
    .filter(Boolean) // Remove null values
    .join(' ') // Join the parts with a space

  return timeLeft
}
