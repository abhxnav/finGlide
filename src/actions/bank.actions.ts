'use server'

import { parseStringify } from '@/lib/utils'
import { plaidClient } from '@/server/plaid'
import {
  Account,
  Bank,
  getAccountProps,
  getInstitutionProps,
  getTransactionsProps,
  Transaction,
} from '@/types'
import { getBank, getBanks } from '@/actions/user.actions'
import { CountryCode } from 'plaid'
import { getTransactionsByBankId } from '@/actions/transaction.action'

export const getAccounts = async ({ userId }: { userId: string }) => {
  try {
    const banks = await getBanks({ userId })

    const accounts = await Promise.all(
      banks?.map(async (bank: Bank) => {
        const accountsRes = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        })
        const accountData = accountsRes.data.accounts[0]

        const institution = await getInstitution({
          institutionId: accountsRes.data.item.institution_id!,
        })

        const {
          account_id,
          balances,
          name,
          official_name,
          mask,
          type,
          subtype,
        } = accountData

        const account = {
          id: account_id,
          availableBalance: balances.available,
          currentBalance: balances.current,
          institutionId: institution.institution_id,
          name,
          officialName: official_name,
          mask,
          type,
          subtype,
          appwriteItemId: bank?.$id,
          shareableId: bank?.shareableId,
        }

        return account
      })
    )

    const totalBanks = accounts.length
    const totalCurrentBalance = accounts.reduce(
      (total: number, account: Account) => {
        return total + account.currentBalance
      },
      0
    )

    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance })
  } catch (error) {
    console.error('Error getting accounts: ', error)
  }
}

export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    const bank = await getBank({ documentId: appwriteItemId })

    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    })
    const accountData = accountsResponse.data.accounts[0]

    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    })

    const transferTransactionsData = await getTransactionsByBankId({
      bankId: bank.$id,
    })

    const transactions = await getTransactions({
      accessToken: bank?.accessToken,
    })

    const transferTransactions = transferTransactionsData.documents.map(
      (transferData: Transaction) => ({
        id: transferData.$id,
        name: transferData.name!,
        amount: transferData.amount!,
        date: transferData.$createdAt,
        paymentChannel: transferData.channel,
        category: transferData.category,
        type: transferData.senderBankId === bank.$id ? 'debit' : 'credit',
      })
    )

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
    }

    // const allTransactions = [...transactions, ...transferTransactions].sort(
    //   (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    // )

    return parseStringify({
      data: account,
      transactions: transactions,
    })
  } catch (error) {
    console.error('Error getting account:', error)
  }
}

export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ['US'] as CountryCode[],
    })

    const intitution = institutionResponse.data.institution

    return parseStringify(intitution)
  } catch (error) {
    console.error('Error getting the institution:', error)
  }
}

export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  let hasMore = true
  let transactions: any = []

  try {
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      })

      const data = response.data

      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : '',
        date: transaction.date,
        image: transaction.logo_url,
      }))

      hasMore = data.has_more
    }

    return parseStringify(transactions)
  } catch (error) {
    console.error('error getting transactions:', error)
  }
}
