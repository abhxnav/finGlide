import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// FORMAT CURRENCY
export const formatAmount = (amount: number): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  })

  return formatter.format(amount)
}

export const parseStringify = (value: any) => {
  try {
    return JSON.parse(JSON.stringify(value))
  } catch (error) {
    console.error('Error parsing JSON:', error)
    return null
  }
}

export const encrypt = (value: string) => btoa(value)

export const decrypt = (value: string) => atob(value)

export const extractCustomerIdFromUrl = (url: string) => {
  const parts = url.split('/')
  const customerId = parts[parts.length - 1]

  return customerId
}
