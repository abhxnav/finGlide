import { getAccounts } from '@/actions/bank.actions'
import { getLoggedInUser } from '@/actions/user.actions'
import { Header, PaymentTransferForm } from '@/components'

const PaymentTransfer = async () => {
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({ userId: loggedIn?.$id })

  if (!accounts) return

  return (
    <section className="flex flex-col p-8 md:max-h-screen xl:py-12 no-scrollbar overflow-y-scroll">
      <Header
        title="Transfer Funds"
        subtext="Seamlessly transfer funds from one account to another."
      />

      <section className="size-full pt-5">
        <PaymentTransferForm accounts={accounts?.data} />
      </section>
    </section>
  )
}

export default PaymentTransfer
