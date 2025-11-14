import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Neo-Brutalism Calculator',
  description: 'A bold, striking calculator with neo-brutalism aesthetics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
