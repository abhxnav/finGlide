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
  dwollaCustomerUrl: string
  dwollaCustomerId: string
}

declare type Bank = {
  $id: string
  accountId: string
  bankId: string
  accessToken: string
  fundingSourceUrl: string
  userId: string
  shareableId: string
}

declare type Transaction = {
  id: string
  $id: string
  name: string
  paymentChannel: string
  type: string
  accountId: string
  amount: number
  pending: boolean
  category: string
  date: string
  image: string
  $createdAt: string
  channel: string
  senderBankId: string
  receiverBankId: string
}

declare type SignInParams = {
  email: string
  password: string
}

declare type SignUpParams = SignInParams & {
  firstName: string
  lastName: string
  address1: string
  city: string
  state: string
  postalCode: string
  dateOfBirth: string
  ssn: string
}

declare interface ExchangePublicTokenParams {
  publicToken: string
  user: User
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

declare interface PlaidLinkProps {
  user: User
  variant?: 'primary' | 'ghost'
}

declare interface CreateFundingSourceOptions {
  customerId: string
  fundingSourceName: string
  plaidToken: string
  _links: object
}

declare type NewDwollaCustomerParams = {
  firstName: string
  lastName: string
  email: string
  type: string
  address1: string
  city: string
  state: string
  postalCode: string
  dateOfBirth: string
  ssn: string
}

declare type TransferParams = {
  sourceFundingSourceUrl: string
  destinationFundingSourceUrl: string
  amount: string
}

declare type AddFundingSourceParams = {
  dwollaCustomerId: string
  processorToken: string
  bankName: string
}

declare interface createBankAccountParams {
  accessToken: string
  userId: string
  accountId: string
  bankId: string
  fundingSourceUrl: string
  shareableId: string
}

declare interface GetBanksParams {
  userId: string
}

declare interface GetBankParams {
  documentId: string
}

declare interface GetUserInfoParams {
  userId: string
}

declare interface getAccountProps {
  appwriteItemId: string
}

declare interface getTransactionsProps {
  accessToken: string
}

declare interface getInstitutionProps {
  institutionId: string
}

declare interface getTransactionsByBankIdParams {
  bankId: string
}

declare interface getBankByAccountIdParams {
  accountId: string
}

declare interface CreateTransactionParams {
  name: string
  amount: string
  senderId: string
  senderBankId: string
  receiverId: string
  receiverBankId: string
  email: string
}

declare interface getTransactionsProps {
  accessToken: string
}

declare interface RecentTransactionsProps {
  accounts: Account[]
  transactions: Transaction[]
  appwriteItemId: string
  page: number
}

declare interface BankTabItemProps {
  account: Account
  appwriteItemId?: string
}

interface UrlQueryParams {
  params: string
  key: string
  value: string
}

declare type AccountTypes =
  | 'depository'
  | 'credit'
  | 'loan '
  | 'investment'
  | 'other'

declare interface BankInfoProps {
  account: Account
  appwriteItemId?: string
  type: 'full' | 'card'
}

declare interface TransactionsTableProps {
  transactions: Transaction[]
}

declare interface CategoryBadgeProps {
  category: string
}

declare interface PaymentTransferFormProps {
  accounts: Account[]
}

declare interface BankDropdownProps {
  accounts: Account[]
  setValue?: UseFormSetValue<any>
  className?: string
}

declare type SearchParamProps = {
  params: { [key: string]: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const authFormSchema = authSchema('sign-up')
declare interface CustomFormFieldProps {
  control: Control<z.infer<typeof authFormSchema>>
  name: string
  label: string
  placeholder: string
  type: 'text' | 'email' | 'password'
}
