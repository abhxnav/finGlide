'use client'

import { formatAmount, formUrlQuery } from '@/lib/utils'
import { Account, BankDropdownProps } from '@/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from '@/components/ui'
import Image from 'next/image'

const BankDropdown = ({
  accounts = [],
  setValue,
  className,
}: BankDropdownProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selected, setSeclected] = useState(accounts[0])

  const handleBankChange = (id: string) => {
    const account = accounts.find((account) => account.appwriteItemId === id)!

    setSeclected(account)
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'id',
      value: id,
    })
    router.push(newUrl, { scroll: false })

    if (setValue) {
      setValue('senderBank', id)
    }
  }

  return (
    <Select
      defaultValue={selected.id}
      onValueChange={(value) => handleBankChange(value)}
    >
      <SelectTrigger
        className={`flex w-full bg-dark-600 gap-3 md:w-[300px] !border-dark-400 ${className}`}
      >
        <Image
          src="assets/icons/checking.svg"
          width={20}
          height={20}
          alt="account"
        />
        <p className="line-clamp-1 w-full text-left text-light-secondary">
          {selected.name}
        </p>
      </SelectTrigger>
      <SelectContent
        className={`w-full bg-dark-600 md:w-[300px] !border-dark-400 ${className}`}
        align="end"
      >
        <SelectGroup>
          <SelectLabel className="py-2 font-normal text-light-primary">
            Select a bank to display
          </SelectLabel>
          {accounts.map((account: Account) => (
            <SelectItem
              key={account.id}
              value={account.appwriteItemId}
              className="cursor-pointer border-t border-dark-400"
            >
              <div className="flex flex-col">
                <p className="text-base font-medium text-light-secondary">
                  {account.name}
                </p>
                <p className="text-sm font-medium text-accent-mint">
                  {formatAmount(account.currentBalance)}
                </p>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default BankDropdown
