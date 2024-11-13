'use client'

import { createTransfer } from '@/actions/dwolla.actions'
import { createTransaction } from '@/actions/transaction.action'
import { getBank, getBankByAccountId } from '@/actions/user.actions'
import { decrypt } from '@/lib/utils'
import { PaymentTransferFormSchema } from '@/lib/validation'
import { PaymentTransferFormProps } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@/components/ui'
import { Loader2 } from 'lucide-react'
import { BankDropdown } from '@/components'

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof PaymentTransferFormSchema>>({
    resolver: zodResolver(PaymentTransferFormSchema),
    defaultValues: {
      name: '',
      email: '',
      amount: '',
      senderBank: '',
      sharableId: '',
    },
  })

  const submit = async (data: z.infer<typeof PaymentTransferFormSchema>) => {
    setIsLoading(true)

    try {
      const receiverAccountId = decrypt(data.sharableId)
      const receiverBank = await getBankByAccountId({
        accountId: receiverAccountId,
      })
      const senderBank = await getBank({ documentId: data.senderBank })

      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: data.amount,
      }

      const transfer = await createTransfer(transferParams)

      if (transfer) {
        const transaction = {
          name: data.name,
          amount: data.amount,
          senderId: senderBank.userId.$id,
          senderBankId: senderBank.$id,
          receiverId: receiverBank.userId.$id,
          receiverBankId: receiverBank.$id,
          email: data.email,
        }

        const newTransaction = await createTransaction(transaction)

        if (newTransaction) {
          form.reset()
          router.push('/')
        }
      }
    } catch (error) {
      console.error('Submitting create transfer request failed: ', error)
    }

    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        <FormField
          control={form.control}
          name="senderBank"
          render={() => (
            <FormItem>
              <div className="flex flex-col gap-3 lg:gap-4 w-full max-w-[800px] py-2">
                <div className="flex flex-col w-full">
                  <FormLabel className="text-base font-medium text-light-primary">
                    Select Source Bank
                  </FormLabel>
                  <FormDescription className="text-sm font-normal text-light-muted">
                    Select the bank account you want to transfer funds from
                  </FormDescription>
                </div>
                <div className="flex flex-col w-full">
                  <FormControl>
                    <BankDropdown
                      accounts={accounts}
                      setValue={form.setValue}
                      className="!w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-3 lg:gap-4 w-full max-w-[800px] py-2">
                <div className="flex flex-col w-full">
                  <FormLabel className="text-base font-medium text-light-primary">
                    Transfer Note (Optional)
                  </FormLabel>
                  <FormDescription className="text-sm font-normal text-light-muted">
                    Please provide any additional information or instructions
                    related to the transfer
                  </FormDescription>
                </div>
                <div className="flex flex-col w-full">
                  <FormControl>
                    <Textarea
                      placeholder="Write a short note here"
                      className="text-base placeholder:text-sm rounded-lg border border-dark-400 text-light-primary placeholder:text-light-muted"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="flex flex-col pb-5 pt-6">
          <h2 className="text-lg font-semibold text-light-primary">
            Bank account details
          </h2>
          <p className="text-md font-normal text-light-muted">
            Enter the bank account details of the recipient
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-3 lg:gap-4 w-full max-w-[800px] py-2">
                <FormLabel className="text-base w-full font-medium text-light-secondary">
                  Recipient&apos;s Email Address
                </FormLabel>
                <div className="flex flex-col w-full">
                  <FormControl>
                    <Input
                      placeholder="ex: johndoe@gmail.com"
                      className="text-base placeholder:text-sm rounded-lg border border-dark-400 text-light-primary placeholder:text-light-muted"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sharableId"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-3 lg:gap-4 w-full max-w-[800px] py-2">
                <FormLabel className="text-base w-full font-medium text-light-secondary">
                  Receiver&apos;s Plaid Sharable Id
                </FormLabel>
                <div className="flex flex-col w-full">
                  <FormControl>
                    <Input
                      placeholder="Enter the public account number"
                      className="text-base placeholder:text-sm rounded-lg border border-dark-400 text-light-primary placeholder:text-light-muted"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-3 lg:gap-4 w-full max-w-[800px] py-2">
                <FormLabel className="text-base w-full font-medium text-light-secondary">
                  Amount
                </FormLabel>
                <div className="flex flex-col w-full">
                  <FormControl>
                    <Input
                      placeholder="ex: 5.00"
                      className="text-base placeholder:text-sm rounded-lg border border-dark-400 text-light-primary placeholder:text-light-muted"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="flex gap-3 w-full max-w-[800px] mt-5 py-2">
          <Button
            type="submit"
            className="text-sm w-full bg-accent-mint font-semibold text-dark-800 hover:bg-accent-mint/80"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
              </>
            ) : (
              'Transfer Funds'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PaymentTransferForm
