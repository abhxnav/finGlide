import { LeftSidebar } from '@/components'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const loggedIn = { firstName: 'Abhinav', lastName: 'kashyap' }

  return (
    <main className="flex h-screen w-full">
      <LeftSidebar user={loggedIn} />
      {children}
    </main>
  )
}
