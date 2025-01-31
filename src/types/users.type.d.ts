type UserType = {
  id: string
  name: string | null
  userName: string
  nickname?: string | null
}

type UserProfileType = UserType & {
  image: string | null
  timezone: string | null
  locale: string | null
}

type CapsulesConfigurationType = {
  minCapsuleDelay: number
  maxCapsuleDelay: number
}

type UserDataType = UserTypeWithAvatar & {
  recipientServices: { id: string; serviceValue: string; type: string }[]
  Contacts: UserType[]
  BlockedUsers: UserType[]
  DefaultAcceptUsers: UserType[]
}
