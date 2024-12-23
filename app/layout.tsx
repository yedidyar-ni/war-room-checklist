import './globals.css'
import { Inter } from 'next/font/google'
import { WarRoomProvider } from '../contexts/WarRoomContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'War Room App',
  description: 'Manage and log war room activities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WarRoomProvider>
          {children}
        </WarRoomProvider>
      </body>
    </html>
  )
}

