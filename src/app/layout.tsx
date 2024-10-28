import type { Metadata } from 'next'
import { Red_Hat_Text } from 'next/font/google'
import './globals.css'

const fontRedHat = Red_Hat_Text({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-red-hat',
})

export const metadata: Metadata = {
  title: 'FinGlide - for a smooth, seamless banking experience.',
  description:
    'FinGlide is a modern banking app designed to make financial management simple, intuitive, and stress-free. With secure, seamless transactions and easy-to-use tools, FinGlide empowers you to navigate your finances with confidence and convenience.',
  icons: {},
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${fontRedHat.variable} antialiased`}>{children}</body>
    </html>
  )
}
