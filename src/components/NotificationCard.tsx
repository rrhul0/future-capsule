import { deleteOneNotification, NotificationType } from '@/lib/firebase'
import { getNotificationTimeString } from '@/utils/timeDate'
import React, { useEffect } from 'react'
import { useIntersection } from '@mantine/hooks'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseInit'
import { SHARING_NOTIFICATION_COLLECTION } from '@/utils/contants'
import { Button } from '@mantine/core'

const NotificationCard = ({ notification }: { notification: NotificationType }) => {
  const { ref, entry } = useIntersection({
    root: document.getElementById('notifications-root'),
    threshold: 0.7
  })

  useEffect(() => {
    if (notification.isRead || !entry?.isIntersecting) return
    // Set isRead to true for the notification
    updateDoc(doc(db, SHARING_NOTIFICATION_COLLECTION, notification.id), {
      ...notification,
      isRead: true,
      readAt: Date.now()
    })
  }, [entry?.isIntersecting, notification.id])

  const onClickRemove = () => {
    deleteOneNotification(notification)
  }

  return (
    <div
      key={notification.id}
      ref={ref}
      className={
        (notification.isRead ? '' : 'bg-gray-800') +
        ' px-4 py-3 flex items-center gap-3 border-b last:border-b-0 border-gray-400'
      }
    >
      <div
        className={(notification.isRead ? 'opacity-0' : 'opacity-100') + ' w-3 h-3 rounded-full bg-blue-600 shrink-0'}
      />
      <div>
        <span className='text-sm font-light'>{getNotificationTimeString(notification)}</span>
        <h3 className='font-bold text-lg'>{notification.title}</h3>
        <p className=''>{notification.message}</p>
      </div>
      <Button onClick={onClickRemove}>Remove</Button>
    </div>
  )
}

export default NotificationCard
