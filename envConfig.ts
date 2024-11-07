import { z } from 'zod'

const envSchema = z.object({
  // Appwrite
  appwriteEndpoint: z.string().url(),
  appwriteProject: z.string(),
  appwriteKey: z.string(),
  appwriteDatabaseId: z.string(),
  appwriteUserCollectionId: z.string(),
  appwriteTransactionCollectionId: z.string(),
  appwriteBankCollectionId: z.string(),

  // Plaid
  plaidClientId: z.string(),
  plaidSecret: z.string(),
  plaidEnv: z.enum(['sandbox', 'development', 'production']).default('sandbox'),
  plaidProducts: z.string().default('auth,transactions,identity'),
  plaidCountryCodes: z.string().default('US'),

  // Dwolla
  dwollaKey: z.string(),
  dwollaSecret: z.string(),
  dwollaBaseUrl: z.string().url(),
  dwollaEnv: z.enum(['sandbox', 'production']).default('sandbox'),
})

const envVars = envSchema.parse({
  // Appwrite
  appwriteEndpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  appwriteProject: process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
  appwriteKey: process.env.NEXT_APPWRITE_KEY,
  appwriteDatabaseId: process.env.APPWRITE_DATABASE_ID,
  appwriteUserCollectionId: process.env.APPWRITE_USER_COLLECTION_ID,
  appwriteTransactionCollectionId:
    process.env.APPWRITE_TRANSACTION_COLLECTION_ID,
  appwriteBankCollectionId: process.env.APPWRITE_BANK_COLLECTION_ID,

  // Plaid
  plaidClientId: process.env.PLAID_CLIENT_ID,
  plaidSecret: process.env.PLAID_SECRET,
  plaidEnv: process.env.PLAID_ENV,
  plaidProducts: process.env.PLAID_PRODUCTS,
  plaidCountryCodes: process.env.PLAID_COUNTRY_CODES,

  // Dwolla
  dwollaKey: process.env.DWOLLA_KEY,
  dwollaSecret: process.env.DWOLLA_SECRET,
  dwollaBaseUrl: process.env.DWOLLA_BASE_URL,
  dwollaEnv: process.env.DWOLLA_ENV,
})

export const envConfig = envVars
