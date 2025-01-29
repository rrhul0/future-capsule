import { addDoc, collection } from 'firebase/firestore'
import { db } from './firebaseInit'

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
    const notificationsRef = collection(db, 'share-notifications')
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
