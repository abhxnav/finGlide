'use server'

import { createAdminClient } from '@/server/appwrite'
import { getTransactionsByBankIdParams } from '@/types'
import { envConfig } from '../../envConfig'
import { Query } from 'node-appwrite'
import { parseStringify } from '@/lib/utils'

const { appwriteDatabaseId, appwriteTransactionCollectionId } = envConfig

export const getTransactionsByBankId = async ({
  bankId,
}: getTransactionsByBankIdParams) => {
  try {
    const { database } = await createAdminClient()

    const senderTransactions = await database.listDocuments(
      appwriteDatabaseId,
      appwriteTransactionCollectionId,
      [Query.equal('senderBankId', bankId)]
    )

    const receiverTransactions = await database.listDocuments(
      appwriteDatabaseId,
      appwriteTransactionCollectionId,
      [Query.equal('receiverBankId', bankId)]
    )

    const transactions = {
      total: senderTransactions.total + receiverTransactions.total,
      documents: [
        ...senderTransactions.documents,
        ...receiverTransactions.documents,
      ],
    }

    return parseStringify(transactions)
  } catch (error) {
    console.error('Error getting transactions by bankId:', error)
  }
}
