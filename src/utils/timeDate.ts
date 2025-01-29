import { NotificationType } from '@/lib/firebase'
import dayjs from 'dayjs'

export const getNotificationTimeString = (notification: NotificationType) => {
  // if today then only show time of notification if yesterday show yesterday with time
  // else show the date and time both
  const createdTime = dayjs(notification.createdAt)
  const now = dayjs()
  if (createdTime.isSame(now, 'day')) {
    return createdTime.format('HH:mm')
  } else if (createdTime.isSame(now.subtract(1, 'day'), 'day')) {
    return `Yesterday at ${createdTime.format('HH:mm')}`
  } else {
    return createdTime.format('YYYY-MM-DD HH:mm')
  }
}
