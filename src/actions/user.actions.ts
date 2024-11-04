'use server'

import { parseStringify } from '@/lib/utils'
import { createAdminClient, createSessionClient } from '@/server/appwrite'
import { SignInParams, SignUpParams } from '@/types'
import { cookies } from 'next/headers'
import { ID } from 'node-appwrite'

export const signUp = async (userData: SignUpParams) => {
  const { email, password, firstName, lastName } = userData
  try {
    const { account } = await createAdminClient()

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    )

    if (newUserAccount) {
      const session = await account.createEmailPasswordSession(email, password)

      const nextCookies = await cookies()
      nextCookies.set('appwrite-session', session.secret, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
      })

      return parseStringify(newUserAccount)
    }
  } catch (error) {
    console.error('Error signing up: ', error)
    return null
  }
}

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const { account } = await createAdminClient()
    const session = await account.createEmailPasswordSession(email, password)

    const nextCookies = await cookies()
    nextCookies.set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    })

    return parseStringify(session)
  } catch (error) {
    console.error('Error signing in: ', error)
    return null
  }
}

export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient()
    const user = await account.get()
    return parseStringify(user)
  } catch (error: any) {
    console.error('Error getting logged in user: ', error)
  }
}

export const logout = async () => {
  try {
    const { account } = await createSessionClient()

    const nextCookies = await cookies()
    nextCookies.delete('appwrite-session')
    await account.deleteSession('current')

    return true
  } catch (error) {
    console.error('Error logging out: ', error)
    return null
  }
}
