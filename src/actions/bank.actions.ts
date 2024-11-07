'use server'

import { parseStringify } from '@/lib/utils'
import { plaidClient } from '@/server/plaid'
import { Account, Bank, getAccountProps, getInstitutionProps } from '@/types'
import { getBank, getBanks } from '@/actions/user.actions'
import { CountryCode } from 'plaid'

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

    return parseStringify({ data: account })
  } catch (error) {
    console.error('An error occurred while getting the account:', error)
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
