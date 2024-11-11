'use client'

import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'

import { cn, formUrlQuery, formatAmount } from '@/lib/utils'
import { AccountTypes, BankInfoProps } from '@/types'

const BankInfo = ({ account, appwriteItemId, type }: BankInfoProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const isActive = appwriteItemId === account?.appwriteItemId

  const handleBankChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'id',
      value: account?.appwriteItemId,
    })
    router.push(newUrl, { scroll: false })
  }

  return (
    <div
      onClick={handleBankChange}
      className={cn(
        `flex gap-4 p-4 transition-all border border-transparent bg-dark-500`,
        {
          'shadow-sm border-accent-mint': type === 'card' && isActive,
          'rounded-xl': type === 'card',
          'hover:shadow-sm cursor-pointer': type === 'card',
        }
      )}
    >
      <figure
        className={`flex items-center justify-center h-fit rounded-full bg-dark-600`}
      >
        <Image
          src="assets/icons/checking.svg"
          width={20}
          height={20}
          alt={account.subtype}
          className="m-2 min-w-5"
        />
      </figure>
      <div className="flex flex-col justify-center flex-1 gap-1 w-full">
        <div className="flex flex-1 items-center justify-between gap-2 overflow-hidden">
          <h2
            className={`text-base line-clamp-1 flex-1 font-bold text-accent-mint`}
          >
            {account.name}
          </h2>
          {type === 'full' && (
            <p
              className={`text-xs rounded-full px-3 py-1 font-medium text-accent-mint/80 bg-dark-600`}
            >
              {account.subtype}
            </p>
          )}
        </div>

        <p className={`text-base font-medium text-accent-mint/80`}>
          {formatAmount(account.currentBalance)}
        </p>
      </div>
    </div>
  )
}

export default BankInfo
