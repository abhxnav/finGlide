'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { z } from 'zod'
import { Button, Form } from '@/components/ui'
import { CustomFormField } from '@/components'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authSchema } from '@/lib/validation'
import { Loader2 } from 'lucide-react'
import { signUp, signIn } from '@/actions/user.actions'
import { useRouter } from 'next/navigation'

const AuthForm = ({ type }: { type: 'sign-in' | 'sign-up' }) => {
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const authFormSchema = authSchema(type)

  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues:
      type === 'sign-in'
        ? { email: '', password: '' }
        : {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address1: '',
            city: '',
            state: '',
            postalCode: '',
            dob: '',
            ssn: '',
          },
  })

  const onSubmit = async (values: z.infer<typeof authFormSchema>) => {
    setIsLoading(true)

    try {
      if (type === 'sign-up') {
        const newUser = await signUp(values)
        setUser(newUser)
      } else if (type === 'sign-in') {
        const res = await signIn({
          email: values.email,
          password: values.password,
        })
        if (res) router.push('/')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="flex flex-col justify-center w-full max-w-[420px] min-h-screen gap-5 py-10 md:gap-8">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/logos/logo-full.png"
            alt="FinGlide"
            width={150}
            height={150}
          />
        </Link>

        <div className="flex flex-col gap-1 md:gap-2">
          <h1 className="text-2xl lg:text-4xl font-semibold text-light-primary">
            {user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
          </h1>
          <p className="text-base font-normal text-light-muted">
            {user
              ? 'Link your account to get started'
              : 'Please enter your details'}
          </p>
        </div>
      </header>

      {user ? (
        <div className="flex flex-col gap-4"></div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === 'sign-up' && (
                <>
                  <div className="flex gap-4">
                    <CustomFormField
                      control={form.control}
                      type="text"
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                    />
                    <CustomFormField
                      control={form.control}
                      type="text"
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <CustomFormField
                    control={form.control}
                    type="text"
                    name="address1"
                    label="Address"
                    placeholder="Enter your address"
                  />
                  <CustomFormField
                    control={form.control}
                    type="text"
                    name="city"
                    label="City"
                    placeholder="Enter your city"
                  />
                  <div className="flex gap-4">
                    <CustomFormField
                      control={form.control}
                      type="text"
                      name="state"
                      label="State"
                      placeholder="Example: New Jersey"
                    />
                    <CustomFormField
                      control={form.control}
                      type="text"
                      name="postalCode"
                      label="Postal Code"
                      placeholder="Example: 08201"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomFormField
                      control={form.control}
                      type="text"
                      name="dob"
                      label="Date of Birth"
                      placeholder="YYYY / MM / DD"
                    />
                    <CustomFormField
                      control={form.control}
                      type="text"
                      name="ssn"
                      label="SSN"
                      placeholder="Example: 1234567"
                    />
                  </div>
                </>
              )}

              <CustomFormField
                control={form.control}
                type="email"
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
              <CustomFormField
                control={form.control}
                type="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
              />
              <div className="flex flex-col">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="text-base rounded-lg bg-accent-mint font-semibold text-dark-800 hover:bg-accent-mint/80"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === 'sign-in' ? (
                    'Sign In'
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className="flex justify-center gap-1 -mt-4">
            <p className="text-sm font-normal text-light-muted">
              {type === 'sign-in'
                ? `Don't have an account?`
                : `Already have an account?`}
            </p>
            <Link
              href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
              className="text-sm cursor-pointer font-medium text-accent-mint"
            >
              {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
            </Link>
          </footer>
        </>
      )}
    </section>
  )
}

export default AuthForm
