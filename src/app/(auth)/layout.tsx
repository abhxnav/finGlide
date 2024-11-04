import { AuthAnimation } from '@/components'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex min-h-screen w-full justify-between relative">
      {children}

      <div className="flex items-center justify-center h-screen w-full sticky top-0 bg-dark-700 max-lg:hidden">
        <div className="flex items-center justify-center w-[70%]">
          <AuthAnimation />
        </div>
      </div>
    </main>
  )
}
