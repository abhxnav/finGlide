import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { transactionsTableColumns } from '@/constants'
import {
  formatAmount,
  formatDateTime,
  getTransactionStatus,
  removeSpecialCharacters,
} from '@/lib/utils'
import { Transaction, TransactionsTableProps } from '@/types'
import { CategoryBadge } from '@/components'

const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  return (
    <Table>
      <TableHeader className="bg-dark-500 pointer-events-none">
        <TableRow>
          {transactionsTableColumns.map((column) => (
            <TableHead
              className={`px-2 text-light-secondary ${
                (column === 'Channel' || column === 'Category') &&
                'max-md:hidden'
              }`}
            >
              {column}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions?.map((transaction: Transaction) => {
          const status = getTransactionStatus(new Date(transaction?.date))
          const amount = formatAmount(transaction?.amount)
          const isCredit = transaction?.type?.toLowerCase() === 'credit'
          const isDebit = transaction?.type?.toLowerCase() === 'debit'

          return (
            <TableRow
              key={transaction.id}
              className={`${
                isDebit || amount[0] === '-'
                  ? 'bg-red-500/5'
                  : 'bg-accent-mint/5'
              } !border-b-light-muted pointer-events-none`}
            >
              <TableCell className="text-light-secondary max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-sm font-semibold truncate">
                    {removeSpecialCharacters(transaction.name)}
                  </h1>
                </div>
              </TableCell>

              <TableCell
                className={`pl-2 pr-10 font-semibold ${
                  isDebit || amount[0] === '-'
                    ? 'text-red-500'
                    : 'text-accent-mint'
                }`}
              >
                {isCredit ? amount : isDebit ? `-${amount}` : amount}
              </TableCell>

              <TableCell className="text-light-secondary pl-2 pr-10">
                <CategoryBadge category={status} />
              </TableCell>

              <TableCell className="text-light-secondary pl-2 pr-10 min-w-32">
                {formatDateTime(new Date(transaction?.date)).dateTime}
              </TableCell>

              <TableCell className="text-light-secondary pl-2 pr-10 capitalize min-w-24">
                {transaction?.paymentChannel}
              </TableCell>

              <TableCell className="text-light-secondary pl-2 pr-10 max-md:hidden">
                {transaction?.category}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default TransactionsTable
