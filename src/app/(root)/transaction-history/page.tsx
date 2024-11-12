import { getAccount, getAccounts } from '@/actions/bank.actions'
import { getLoggedInUser } from '@/actions/user.actions'
import { Header, TransactionsTable } from '@/components'
import { formatAmount } from '@/lib/utils'
import { SearchParamProps } from '@/types'

const TransactionHistory = async ({ searchParams }: SearchParamProps) => {
  const { id } = await searchParams

  console.log(id)

  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({ userId: loggedIn?.$id })

  if (!accounts) return

  const appwriteItemId = (id as string) || accounts?.data[0]?.appwriteItemId

  const account = await getAccount({ appwriteItemId })

  return (
    <section className="flex max-h-screen w-full flex-col gap-8 overflow-y-scroll bg-gray-25 p-8 xl:py-12">
      <div className="flex flex-col items-start justify-between gap-8 w-full md:flex-row">
        <Header
          title="Transaction History"
          subtext="See your bank details and transactions in detail."
        />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 rounded-lg border-y bg-accent-mint px-4 py-5 md:flex-row">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-dark-800">
              {account?.data?.name}
            </h2>
            <p className="text-sm text-dark-800 font-semibold">
              {account?.data?.officialName}
            </p>
            <p className="text-sm font-semibold tracking-[2px] text-dark-500">
              &#9679;&#9679;&#9679;&#9679; &#9679;&#9679;&#9679;&#9679;
              &#9679;&#9679;&#9679;&#9679; {account?.data?.mask}
            </p>
          </div>

          <div className="flex items-center justify-center flex-col gap-2 rounded-md bg-[#2c9a7157] px-4 py-2 text-dark-800">
            <p className="text-sm font-semibold">Current balance</p>
            <p className="text-2xl text-center font-bold">
              {formatAmount(account?.data?.currentBalance)}
            </p>
          </div>
        </div>

        <section className="flex flex-col gap-6 w-full">
          <TransactionsTable transactions={account?.transactions} />
        </section>
      </div>
    </section>
  )
}

export default TransactionHistory
