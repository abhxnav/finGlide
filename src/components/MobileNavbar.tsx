'use client'

import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { MobileNavbarProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SidebarFooter } from '@/components'

const MobileNavbar = ({ user }: MobileNavbarProps) => {
  const pathname = usePathname()

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="menu"
            width={30}
            height={30}
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="border-none bg-dark-600 w-fit text-white"
        >
          <Link href="/" className="cursor-pointer">
            <Image
              src="/assets/logos/logo-full.png"
              alt="FinGlide"
              width={150}
              height={150}
            />
          </Link>

          <div className="flex flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 pt-16 text-light-secondary">
                {sidebarLinks.map((link) => {
                  const isActive =
                    link.route === pathname ||
                    pathname.startsWith(`${link.route}/`)

                  return (
                    <SheetClose asChild key={link.route}>
                      <Link
                        href={link.route}
                        className={cn(
                          'flex items-center w-full max-w-60 gap-3 p-4 rounded-lg',
                          { 'bg-accent-mint': isActive }
                        )}
                      >
                        <Image
                          src={link.imgURL}
                          alt={link.label}
                          width={20}
                          height={20}
                          className={cn({
                            'brightness-0 invert-0': isActive,
                          })}
                        />
                        <p
                          className={cn(
                            'text-base font-semibold text-light-secondary',
                            { 'text-dark-800': isActive }
                          )}
                        >
                          {link.label}
                        </p>
                      </Link>
                    </SheetClose>
                  )
                })}

                {/* TODO: Add user details */}
              </nav>
            </SheetClose>

            <SidebarFooter user={user} type="mobile" />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNavbar
