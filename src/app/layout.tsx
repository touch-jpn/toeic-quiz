import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TOEIC 金フレ 英単語クイズ',
  description: 'TOEIC頻出ビジネス単語1500語の5択クイズ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {children}
      </body>
    </html>
  )
}
