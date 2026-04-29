import type { MetadataRoute } from 'next'

const siteUrl = 'https://toeic-quiz-touch-jpn.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
