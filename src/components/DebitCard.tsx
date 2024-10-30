import { formatAmount } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

const DebitCard = ({
  account,
  userName,
  showBalance = true,
}: DebitCardProps) => {
  return (
    <div className="flex flex-col">
      <Link
        href="/"
        className="relative flex justify-between w-full max-w-80 h-48 rounded-2xl border border-dark-400 backdrop-blur-sm debit-card-gradient"
      >
        <div className="flex flex-col justify-between z-10 size-full max-w-56 rounded-l-2xl debit-card-gradient px-5 pb-4 pt-5 relative">
          <div>
            <h1 className="text-base font-semibold text-dark-500">
              {account.name || userName}
            </h1>
            <p className="font-black text-dark-500">
              {formatAmount(account.currentBalance)}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-xs font-semibold text-dark-500">
                {userName}
              </h1>
              <h2 className="text-xs font-semibold text-dark-500">
                &#9679;&#9679; / &#9679;&#9679;
              </h2>
            </div>
            <p className="text-sm font-semibold tracking-[2px] text-dark-500">
              &#9679;&#9679;&#9679;&#9679; &#9679;&#9679;&#9679;&#9679;
              &#9679;&#9679;&#9679;&#9679;{' '}
              <span className="text-base"> 1234</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between flex-1 size-full rounded-r-2xl bg-accent-slate py-5 pr-5">
          <Image src="/assets/icons/nfc.svg" alt="nfc" width={25} height={25} />
          <Image
            src="/assets/icons/mastercard.svg"
            alt="mastercard"
            width={35}
            height={32}
            className="ml-5"
          />
        </div>
      </Link>
    </div>
  )
}

export default DebitCard
