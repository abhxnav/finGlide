import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid'
import { envConfig } from '../../envConfig'

const { plaidClientId, plaidSecret } = envConfig

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': plaidClientId,
      'PLAID-SECRET': plaidSecret,
    },
  },
})

export const plaidClient = new PlaidApi(configuration)
