import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore'
import { db } from './firebaseInit'
import { SHARING_NOTIFICATION_COLLECTION } from '@/utils/contants'

export interface NotificationData {
  title: string
  message: string
  userId: string
  sentBy: {
    name?: string
    userId: string
    userName: string
  }
  iconUrl?: string
}

export interface NotificationType extends NotificationData {
  isRead: boolean
  createdAt: number
  readAt: number | null
  id: string
}

export const createFirestoreNotificationEntry = async (notification: NotificationData) => {
  try {
    const notificationsRef = collection(db, SHARING_NOTIFICATION_COLLECTION)
    const docRef = await addDoc(notificationsRef, {
      ...notification,
      isRead: false,
      createdAt: Date.now(),
      readAt: null
    })
    return docRef.id
  } catch (e) {
    console.error(e)
    return null
  }
}

export const deleteOneNotification = (notification: NotificationType) => {
  deleteDoc(doc(db, SHARING_NOTIFICATION_COLLECTION, notification.id))
}
