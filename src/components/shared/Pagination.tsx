'use client'

import { formUrlQuery } from '@/lib/utils'
import { PaginationProps } from '@/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui'
import Image from 'next/image'

const Pagination = ({ page, totalPages }: PaginationProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleNavigation = (type: 'next' | 'prev') => {
    const pageNumber = type === 'prev' ? page - 1 : page + 1

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: pageNumber.toString(),
    })

    router.push(newUrl, { scroll: false })
  }

  return (
    <div className="flex justify-between gap-3">
      <Button
        size="lg"
        variant="ghost"
        className="p-0 hover:bg-transparent text-light-secondary"
        onClick={() => handleNavigation('prev')}
        disabled={Number(page) <= 1}
      >
        <Image
          src="/assets/icons/left-arrow.svg"
          alt="arrow"
          width={15}
          height={15}
          className="mr-2"
        />
        Prev
      </Button>
      <p className="text-sm flex items-center px-2 text-light-secondary">
        {page} / {totalPages}
      </p>
      <Button
        size="lg"
        variant="ghost"
        className="p-0 hover:bg-transparent text-light-secondary"
        onClick={() => handleNavigation('next')}
        disabled={Number(page) >= totalPages}
      >
        Next
        <Image
          src="/assets/icons/left-arrow.svg"
          alt="arrow"
          width={15}
          height={15}
          className="ml-2 -scale-x-100"
        />
      </Button>
    </div>
  )
}

export default Pagination
