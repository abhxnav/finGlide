declare type Account = {
  id: string
  availableBalance: number
  currentBalance: number
  officialName: string
  mask: string
  institutionId: string
  name: string
  type: string
  subtype: string
  appwriteItemId: string
  shareableId: string
}

declare interface HeaderProps {
  type?: 'title' | 'greeting'
  title: string
  subtext: string
  user?: string
}

declare interface TotalBalanceProps {
  accounts: Account[]
  totalBanks: number
  totalCurrentBalance: number
}

declare interface DoughnutChartProps {
  accounts: Account[]
}
