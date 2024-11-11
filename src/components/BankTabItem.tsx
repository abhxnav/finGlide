'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { cn, formUrlQuery } from '@/lib/utils'
import { BankTabItemProps } from '@/types'

const BankTabItem = ({ account, appwriteItemId }: BankTabItemProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
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
        `flex gap-4 border-b-2 px-2 sm:px-4 py-2 transition-all bg-transparent`,
        {
          ' border-accent-mint': isActive,
        }
      )}
    >
      <p
        className={cn(
          `text-base line-clamp-1 flex-1 font-medium text-light-muted`,
          {
            ' text-accent-mint': isActive,
          }
        )}
      >
        {account.name}
      </p>
    </div>
  )
}

export default BankTabItem
