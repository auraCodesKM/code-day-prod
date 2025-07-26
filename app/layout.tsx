import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mission Launch: Burn or Glory',
  description: 'Stake your NFT spaceship for glory or watch it burn in the cosmos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-space-black overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}
