import type { Metadata } from 'next'
import './globals.css'

const siteUrl = 'https://toeic-quiz-nine.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'TOEIC英単語クイズ｜金フレレベル1500語を5択で学習',
    template: '%s｜TOEIC英単語クイズ',
  },
  description:
    'TOEICに頻出するビジネス英単語1500語を5択クイズで学習。英和・和英の2モード、600点・730点・860点レベル別に対応。例文付きで単語をしっかり定着させよう。',
  keywords: [
    'TOEIC',
    '英単語',
    'クイズ',
    '金フレ',
    '5択',
    '英語学習',
    '英単語アプリ',
    'TOEIC対策',
    'ビジネス英語',
    '英和',
    '和英',
  ],
  authors: [{ name: 'touch-jpn' }],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: siteUrl,
    siteName: 'TOEIC英単語クイズ',
    title: 'TOEIC英単語クイズ｜金フレレベル1500語を5択で学習',
    description:
      'TOEICに頻出するビジネス英単語1500語を5択クイズで学習。英和・和英の2モード、レベル別に対応。例文付き。',
  },
  twitter: {
    card: 'summary',
    title: 'TOEIC英単語クイズ｜金フレレベル1500語',
    description: 'TOEICに頻出するビジネス英単語1500語を5択クイズで学習。例文付き。',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: '9lDcGciQD0HiezWVcWKAKfzcXL1fFTemTVe8Ofxulmg',
  },
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
