'use server'

import { Client, Account, Databases, Users } from 'node-appwrite'
import { cookies } from 'next/headers'
import { envConfig } from '../../envConfig'

const { appwriteEndpoint, appwriteProject, appwriteKey } = envConfig

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(appwriteEndpoint)
    .setProject(appwriteProject)

  const nextCookies = await cookies()
  const session = nextCookies.get('appwrite-session')
  if (!session || !session.value) {
    throw new Error('No session')
  }

  client.setSession(session.value)

  return {
    get account() {
      return new Account(client)
    },
  }
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(appwriteEndpoint)
    .setProject(appwriteProject)
    .setKey(appwriteKey)

  return {
    get account() {
      return new Account(client)
    },
    get database() {
      return new Databases(client)
    },
    get user() {
      return new Users(client)
    },
  }
}
