import { getLoggedInUser } from '@/actions/user.actions'
import { LeftSidebar, MobileNavbar } from '@/components'
import Image from 'next/image'
import { redirect } from 'next/navigation'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const loggedIn = await getLoggedInUser()
  // if (!loggedIn) redirect('/sign-in')

  return (
    <main className="flex h-screen w-full">
      <LeftSidebar user={loggedIn} />

      <div className="flex flex-col size-full">
        <div className="flex items-center justify-between h-16 p-5 sm:p-8 md:hidden">
          <Image
            src="/assets/logos/logo-icon.png"
            alt="FinGlide"
            width={30}
            height={30}
          />
          <div>
            <MobileNavbar user={loggedIn} />
          </div>
        </div>
        {children}
      </div>
    </main>
  )
}
