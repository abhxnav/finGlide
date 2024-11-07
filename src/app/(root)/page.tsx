import { getAccount, getAccounts } from '@/actions/bank.actions'
import { getLoggedInUser } from '@/actions/user.actions'
import { Header, RightSidebar, TotalBalance } from '@/components'
import { SearchParamProps } from '@/types'

const Home = async ({ searchParams: { id } }: SearchParamProps) => {
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({ userId: loggedIn?.$id })

  if (!accounts) return

  const appwriteItemId = (id as string) || accounts?.data[0]?.appwriteItemId

  const account = await getAccount({ appwriteItemId })

  return (
    <section className="no-scrollbar flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll">
      <div className="no-scrollbar flex w-full flex-col flex-1 gap-8 px-5 sm:px-8 py-7 lg:py-12 xl:max-h-screen xl:overflow-y-scroll">
        <header className="flex flex-col justify-between gap-8">
          <Header
            type="greeting"
            title="Welcome"
            subtext="Access and manage your account and transactions efficiently."
            user={loggedIn?.firstName || 'Guest'}
          />

          <TotalBalance
            accounts={accounts?.data}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>

        {/* TODO: Add recent transactions section */}
      </div>

      <RightSidebar
        user={loggedIn}
        transactions={accounts?.transactions}
        banks={accounts?.data?.slice(0, 2)}
      />
    </section>
  )
}

export default Home
