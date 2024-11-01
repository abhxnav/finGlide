'use client'

import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { LeftSidebarProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LeftSidebar = ({ user }: LeftSidebarProps) => {
  const pathname = usePathname()

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between border-r border-dark-400 pt-8 text-white max-md:hidden sm:p-4 xl:p-6 2xl:w-[350px] xl:w-[320px]">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="cursor-pointer mb-12">
          <Image
            src="/assets/logos/logo-icon.png"
            alt="FinGlide"
            width={2000}
            height={2000}
            className="size-14 xl:hidden"
          />
          <Image
            src="/assets/logos/logo-full.png"
            alt="FinGlide"
            width={2000}
            height={2000}
            className="w-[70%] h-fit max-xl:hidden"
          />
        </Link>

        {sidebarLinks.map((link) => {
          const isActive =
            link.route === pathname || pathname.startsWith(`${link.route}/`)

          return (
            <Link
              href={link.route}
              key={link.label}
              className={cn(
                'flex gap-3 items-center py-1 md:p-3 2xl:p-4 rounded-lg justify-center xl:justify-start',
                { 'bg-accent-mint': isActive }
              )}
            >
              <div className="relative size-6">
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  fill
                  className={cn({ 'brightness-0 invert-0': isActive })}
                />
              </div>
              <p
                className={cn(
                  'text-base font-semibold text-light-secondary max-xl:hidden',
                  { 'text-dark-800': isActive }
                )}
              >
                {link.label}
              </p>
            </Link>
          )
        })}

        {/* TODO: Add user details */}
      </nav>

      {/* TODO: Add footer */}
    </section>
  )
}

export default LeftSidebar
