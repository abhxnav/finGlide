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
        <Button>Connect bank</Button>
      ) : (
        <Button>Connect bank</Button>
      )}
    </>
  )
}

export default PlaidLink
