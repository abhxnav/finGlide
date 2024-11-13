'use server'

import { encrypt, extractCustomerIdFromUrl, parseStringify } from '@/lib/utils'
import { createAdminClient, createSessionClient } from '@/server/appwrite'
import { plaidClient } from '@/server/plaid'
import {
  createBankAccountParams,
  ExchangePublicTokenParams,
  getBankByAccountIdParams,
  GetBankParams,
  GetBanksParams,
  GetUserInfoParams,
  SignInParams,
  SignUpParams,
  User,
} from '@/types'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { ID, Query } from 'node-appwrite'
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
import { envConfig } from '../../envConfig'

const {
  appwriteDatabaseId,
  appwriteUserCollectionId,
  appwriteBankCollectionId,
} = envConfig

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
      appwriteDatabaseId,
      appwriteUserCollectionId,
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
  }
}

const getUserInfo = async ({ userId }: GetUserInfoParams) => {
  try {
    const { database } = await createAdminClient()

    const user = await database.listDocuments(
      appwriteDatabaseId!,
      appwriteUserCollectionId!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(user.documents[0])
  } catch (error) {
    console.error('Error getting user info: ', error)
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

    const user = await getUserInfo({ userId: session?.userId })

    return parseStringify(user)
  } catch (error) {
    console.error('Error signing in: ', error)
  }
}

export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient()
    const { $id } = await account.get()

    const user = await getUserInfo({ userId: $id })

    return parseStringify(user)
  } catch (error: any) {
    console.error('Error getting logged in user: ', error)
    return null
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
      client_name: `FinGlide`,
      products: ['auth', 'transactions'] as Products[],
      transactions: {
        days_requested: 730,
      },
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
      appwriteDatabaseId!,
      appwriteBankCollectionId!,
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

export const getBanks = async ({ userId }: GetBanksParams) => {
  try {
    const { database } = await createAdminClient()

    const banks = await database.listDocuments(
      appwriteDatabaseId!,
      appwriteBankCollectionId!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(banks.documents)
  } catch (error) {
    console.error(error)
  }
}

export const getBank = async ({ documentId }: GetBankParams) => {
  try {
    const { database } = await createAdminClient()

    const bank = await database.listDocuments(
      appwriteDatabaseId!,
      appwriteBankCollectionId!,
      [Query.equal('$id', [documentId])]
    )
    return parseStringify(bank.documents[0])
  } catch (error) {
    console.error(error)
  }
}

export const getBankByAccountId = async ({
  accountId,
}: getBankByAccountIdParams) => {
  try {
    const { database } = await createAdminClient()

    const bank = await database.listDocuments(
      appwriteDatabaseId,
      appwriteBankCollectionId,
      [Query.equal('accountId', [accountId])]
    )

    if (bank.total !== 1) return null

    return parseStringify(bank.documents[0])
  } catch (error) {
    console.error('Error getting bank by account id: ', error)
  }
}
