import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AutoGram - Automação de Instagram',
  description: 'Plataforma brasileira de automação de marketing no Instagram',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
