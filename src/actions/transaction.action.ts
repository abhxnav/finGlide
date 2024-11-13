'use server'

import { createAdminClient } from '@/server/appwrite'
import { CreateTransactionParams, getTransactionsByBankIdParams } from '@/types'
import { envConfig } from '../../envConfig'
import { ID, Query } from 'node-appwrite'
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

export const createTransaction = async (
  transaction: CreateTransactionParams
) => {
  try {
    const { database } = await createAdminClient()

    const newTransaction = await database.createDocument(
      appwriteDatabaseId,
      appwriteTransactionCollectionId,
      ID.unique(),
      { channel: 'online', category: 'Transfer', ...transaction }
    )

    return parseStringify(newTransaction)
  } catch (error) {
    console.error('Error creating transaction: ', error)
  }
}
