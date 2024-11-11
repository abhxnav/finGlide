import { getAccount, getAccounts } from '@/actions/bank.actions'
import { getLoggedInUser } from '@/actions/user.actions'
import {
  Header,
  RecentTransactions,
  RightSidebar,
  TotalBalance,
} from '@/components'
import { SearchParamProps, Transaction } from '@/types'
import { redirect } from 'next/navigation'

const Home = async ({ searchParams }: SearchParamProps) => {
  const { id, page } = await searchParams

  const currentPage = Number(page) || 1

  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({ userId: loggedIn?.$id })

  if (!loggedIn) redirect('/sign-in')
  if (!accounts) return

  const appwriteItemId = (id as string) || accounts?.data[0]?.appwriteItemId

  const account = await getAccount({ appwriteItemId })

  const transactions: Transaction[] = [
    {
      id: '1',
      $id: 'txn_1',
      name: 'Coffee Shop',
      paymentChannel: 'POS',
      type: 'Debit',
      accountId: 'acc_001',
      amount: 4.75,
      pending: false,
      category: 'Food & Drink',
      date: '2024-11-01',
      image: '/images/coffee.png',
      $createdAt: '2024-11-01T10:00:00Z',
      channel: 'Card',
      senderBankId: 'bank_001',
      receiverBankId: 'bank_002',
    },
    {
      id: '2',
      $id: 'txn_2',
      name: 'Uber Ride',
      paymentChannel: 'Online',
      type: 'Debit',
      accountId: 'acc_002',
      amount: 15.2,
      pending: false,
      category: 'Transport',
      date: '2024-11-01',
      image: '/images/uber.png',
      $createdAt: '2024-11-01T11:30:00Z',
      channel: 'App',
      senderBankId: 'bank_001',
      receiverBankId: 'bank_003',
    },
    {
      id: '3',
      $id: 'txn_3',
      name: 'Grocery Store',
      paymentChannel: 'POS',
      type: 'Debit',
      accountId: 'acc_003',
      amount: 60.4,
      pending: false,
      category: 'Groceries',
      date: '2024-10-31',
      image: '/images/groceries.png',
      $createdAt: '2024-10-31T14:45:00Z',
      channel: 'Card',
      senderBankId: 'bank_002',
      receiverBankId: 'bank_004',
    },
    {
      id: '4',
      $id: 'txn_4',
      name: 'Salary',
      paymentChannel: 'Direct Deposit',
      type: 'Credit',
      accountId: 'acc_004',
      amount: 2000.0,
      pending: false,
      category: 'Income',
      date: '2024-10-31',
      image: '/images/salary.png',
      $createdAt: '2024-10-31T08:00:00Z',
      channel: 'Bank Transfer',
      senderBankId: 'bank_005',
      receiverBankId: 'bank_002',
    },
    {
      id: '5',
      $id: 'txn_5',
      name: 'Electricity Bill',
      paymentChannel: 'Online',
      type: 'Debit',
      accountId: 'acc_005',
      amount: 85.0,
      pending: false,
      category: 'Utilities',
      date: '2024-10-29',
      image: '/images/electricity.png',
      $createdAt: '2024-10-29T13:15:00Z',
      channel: 'App',
      senderBankId: 'bank_002',
      receiverBankId: 'bank_006',
    },
    {
      id: '6',
      $id: 'txn_6',
      name: 'Amazon Purchase',
      paymentChannel: 'Online',
      type: 'Debit',
      accountId: 'acc_006',
      amount: 45.99,
      pending: true,
      category: 'Shopping',
      date: '2024-10-28',
      image: '/images/amazon.png',
      $createdAt: '2024-10-28T15:00:00Z',
      channel: 'App',
      senderBankId: 'bank_003',
      receiverBankId: 'bank_004',
    },
    {
      id: '7',
      $id: 'txn_7',
      name: 'Dinner Restaurant',
      paymentChannel: 'POS',
      type: 'Debit',
      accountId: 'acc_007',
      amount: 35.5,
      pending: false,
      category: 'Food & Drink',
      date: '2024-10-27',
      image: '/images/restaurant.png',
      $createdAt: '2024-10-27T19:30:00Z',
      channel: 'Card',
      senderBankId: 'bank_004',
      receiverBankId: 'bank_001',
    },
    {
      id: '8',
      $id: 'txn_8',
      name: 'Gym Membership',
      paymentChannel: 'POS',
      type: 'Debit',
      accountId: 'acc_008',
      amount: 50.0,
      pending: false,
      category: 'Health & Fitness',
      date: '2024-10-25',
      image: '/images/gym.png',
      $createdAt: '2024-10-25T10:45:00Z',
      channel: 'Card',
      senderBankId: 'bank_001',
      receiverBankId: 'bank_003',
    },
    {
      id: '9',
      $id: 'txn_9',
      name: 'Movie Ticket',
      paymentChannel: 'Online',
      type: 'Debit',
      accountId: 'acc_009',
      amount: 12.5,
      pending: false,
      category: 'Entertainment',
      date: '2024-10-24',
      image: '/images/movie.png',
      $createdAt: '2024-10-24T18:30:00Z',
      channel: 'App',
      senderBankId: 'bank_002',
      receiverBankId: 'bank_005',
    },
    {
      id: '10',
      $id: 'txn_10',
      name: 'Freelance Payment',
      paymentChannel: 'Direct Deposit',
      type: 'Credit',
      accountId: 'acc_010',
      amount: 500.0,
      pending: false,
      category: 'Income',
      date: '2024-10-23',
      image: '/images/freelance.png',
      $createdAt: '2024-10-23T09:00:00Z',
      channel: 'Bank Transfer',
      senderBankId: 'bank_006',
      receiverBankId: 'bank_001',
    },
  ]

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

        <RecentTransactions
          accounts={accounts?.data}
          transactions={transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
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
