'use client'

import { useCallback, useEffect, useState } from 'react'
import { PlaidLinkProps } from '@/types'
import { Button } from '@/components/ui'
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from 'react-plaid-link'
import { useRouter } from 'next/navigation'
import {
  createPlaidLinkToken,
  exchangePublicToken,
} from '@/actions/user.actions'
import Image from 'next/image'

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter()

  const [token, setToken] = useState('')

  useEffect(() => {
    const getToken = async () => {
      const data = await createPlaidLinkToken(user)
      setToken(data?.token)
    }

    getToken()
  }, [user])

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      await exchangePublicToken({
        publicToken: public_token,
        user,
      })

      router.push('/')
    },

    [user]
  )

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  }

  const { open, ready } = usePlaidLink(config)

  return (
    <>
      {variant === 'primary' ? (
        <Button
          onClick={() => open()}
          disabled={!ready}
          className="text-base rounded-lg bg-accent-mint font-semibold text-dark-700 shadow-sm hover:bg-accent-mint/70"
        >
          Connect bank
        </Button>
      ) : variant === 'ghost' ? (
        <Button
          onClick={() => open()}
          variant="ghost"
          className="flex cursor-pointer items-center justify-center gap-3 rounded-lg px-3 py-7 hover:bg-white lg:justify-start"
        >
          <Image
            src="/assets/icons/checking.svg"
            alt="connect bank"
            width={24}
            height={24}
          />
          <p className="text-base font-semibold text-light-secondary hidden xl:block">
            Connect Bank
          </p>
        </Button>
      ) : (
        <Button
          onClick={() => open()}
          className="flex !justify-start cursor-pointer gap-3 rounded-lg !bg-transparent flex-row"
        >
          <Image
            src="/assets/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
          />
          <p className="text-base font-semibold text-light-secondary">
            Connect Bank
          </p>
        </Button>
      )}
    </>
  )
}

export default PlaidLink
