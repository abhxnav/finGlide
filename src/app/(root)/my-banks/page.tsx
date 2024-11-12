import { getAccounts } from '@/actions/bank.actions'
import { getLoggedInUser } from '@/actions/user.actions'
import { DebitCard, Header } from '@/components'
import { Account } from '@/types'

const MyBanks = async () => {
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({ userId: loggedIn?.$id })

  return (
    <section className="flex">
      <div className="flex h-screen max-h-screen w-full flex-col gap-8 bg-gray-25 p-8 xl:py-12">
        <Header
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activities."
        />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-light-primary">
            Your cards
          </h2>
          <div className="flex flex-wrap gap-6">
            {accounts?.data?.map((account: Account) => (
              <DebitCard
                key={account?.id}
                account={account}
                userName={loggedIn?.firstName}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyBanks
