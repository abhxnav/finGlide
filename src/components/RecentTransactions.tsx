import { Account, RecentTransactionsProps } from '@/types'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { BankInfo, BankTabItem, TransactionsTable } from '@/components'

const RecentTransactions = ({
  accounts,
  transactions = [],
  appwriteItemId,
  page = 1,
}: RecentTransactionsProps) => {
  return (
    <section className="flex flex-col gap-6 w-full">
      <header className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold text-light-primary">
          Recent transactions
        </h2>
        <Link
          href={`/transaction-history/?=${appwriteItemId}`}
          className="text-sm rounded-lg border border-dark-400 px-4 py-2.5 font-semibold text-light-muted"
        >
          View all
        </Link>
      </header>

      <Tabs defaultValue={appwriteItemId} className="w-full">
        <TabsList className="flex flex-nowrap mb-8 w-full custom-scrollbar bg-transparent">
          {accounts?.map((account) => (
            <TabsTrigger
              key={account?.id}
              value={account?.appwriteItemId}
              style={{ background: 'transparent' }}
            >
              <BankTabItem
                key={account.id}
                account={account}
                appwriteItemId={appwriteItemId}
              />
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts?.map((account: Account) => (
          <TabsContent
            key={account?.id}
            value={account?.appwriteItemId}
            className="space-y-4"
          >
            <BankInfo
              account={account}
              appwriteItemId={appwriteItemId}
              type="full"
            />
          </TabsContent>
        ))}
      </Tabs>

      <TransactionsTable transactions={transactions} />
    </section>
  )
}

export default RecentTransactions
