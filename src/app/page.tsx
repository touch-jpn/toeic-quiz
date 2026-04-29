import HomeClient from './_components/HomeClient'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'TOEIC英単語クイズ',
  description:
    'TOEICに頻出するビジネス英単語1500語を5択クイズで学習。英和・和英の2モード、レベル別対応。例文付き。',
  url: 'https://toeic-quiz-nine.vercel.app',
  applicationCategory: 'EducationalApplication',
  inLanguage: ['ja', 'en'],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  audience: { '@type': 'Audience', audienceType: 'TOEIC受験者・英語学習者' },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  )
}
