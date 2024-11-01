import { CounterAnimation, DoughnutChart } from '@/components'
import { TotalBalanceProps } from '@/types'

const TotalBalance = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: TotalBalanceProps) => {
  return (
    <section className="flex w-full items-center gap-4 rounded-xl border border-dark-400 p-4 shadow-chart sm:gap-6 sm:p-6">
      <div className="flex size-full max-w-24 items-center sm:max-w-[120px]">
        <DoughnutChart accounts={accounts} />
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-light-primary">
          Bank Accounts : {totalBanks}
        </h2>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-light-muted">
            Total Current Balance
          </p>
          <div className="text-2xl lg:text-3xl flex-1 font-semibold text-light-primary flex items-center justify-center gap-2">
            <CounterAnimation amount={totalCurrentBalance} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TotalBalance
