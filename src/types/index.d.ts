import { Control } from 'react-hook-form'
import { authSchema } from '@/lib/validation'

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

declare type User = {
  $id: string
  email: string
  userId: string
  firstName: string
  lastName: string
  name: string
  address1: string
  city: string
  state: string
  postalCode: string
  dateOfBirth: string
}

declare type SignInParams = {
  email: string
  password: string
}

declare type SignUpParams = SignInParams & {
  firstName?: string
  lastName?: string
  address1?: string
  city?: string
  state?: string
  postalCode?: string
  dateOfBirth?: string
  ssn?: string
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

declare interface LeftSidebarProps {
  user: User
}

declare interface MobileNavbarProps {
  user: User
}

declare interface RightSidebarProps {
  user: User
  transactions: any
  banks: any
}

declare interface DebitCardProps {
  account: Account
  userName: string
  showBalance?: boolean
}

declare interface FooterProps {
  user: User
  type?: 'desktop' | 'mobile'
}

const authFormSchema = authSchema('sign-up')
declare interface CustomFormFieldProps {
  control: Control<z.infer<typeof authFormSchema>>
  name: string
  label: string
  placeholder: string
  type: 'text' | 'email' | 'password'
}
