'use server'

import { encrypt, extractCustomerIdFromUrl, parseStringify } from '@/lib/utils'
import { createAdminClient, createSessionClient } from '@/server/appwrite'
import { plaidClient } from '@/server/plaid'
import {
  createBankAccountParams,
  ExchangePublicTokenParams,
  SignInParams,
  SignUpParams,
  User,
} from '@/types'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { ID } from 'node-appwrite'
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from 'plaid'
import {
  addFundingSource,
  createDwollaCustomer,
} from '@/actions/dwolla.actions'

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData

  let newUserAccount

  try {
    const { account, database } = await createAdminClient()

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    )

    if (!newUserAccount) throw new Error('Error creating user')

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: 'personal',
    })

    if (!dwollaCustomerUrl) throw new Error('Error creating Dwolla customer')

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl)

    const newUser = await database.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      }
    )

    const session = await account.createEmailPasswordSession(email, password)

    const nextCookies = await cookies()
    nextCookies.set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    })

    return parseStringify(newUser)
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

export const createPlaidLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user?.$id,
      },
      client_name: `${user?.firstName} ${user?.lastName}`,
      products: ['auth'] as Products[],
      language: 'en',
      country_codes: ['US'] as CountryCode[],
    }

    const res = await plaidClient?.linkTokenCreate(tokenParams)

    return parseStringify({ token: res?.data?.link_token })
  } catch (error) {
    console.error(error)
  }
}

const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountParams) => {
  try {
    const { database } = await createAdminClient()

    const bankAccount = await database.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    )

    return parseStringify(bankAccount)
  } catch (error) {
    console.error('Error creating bank account: ', error)
  }
}

export const exchangePublicToken = async ({
  publicToken,
  user,
}: ExchangePublicTokenParams) => {
  try {
    const res = await plaidClient?.itemPublicTokenExchange({
      public_token: publicToken,
    })

    const accessToken = res?.data?.access_token
    const itemId = res?.data?.item_id

    const accounstRes = await plaidClient?.accountsGet({
      access_token: accessToken,
    })

    const accountData = accounstRes?.data?.accounts[0]

    const req: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData?.account_id,
      processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum,
    }

    const processorTokenRes = await plaidClient?.processorTokenCreate(req)
    const processorToken = processorTokenRes?.data?.processor_token

    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user?.dwollaCustomerId,
      processorToken,
      bankName: accountData?.name,
    })

    if (!fundingSourceUrl) throw Error

    await createBankAccount({
      userId: user?.$id,
      bankId: itemId,
      accountId: accountData?.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encrypt(accountData.account_id),
    })

    revalidatePath('/')

    return parseStringify({ publicTokenExchanged: true })
  } catch (error) {
    console.error('Error exchanging public token: ', error)
  }
}
