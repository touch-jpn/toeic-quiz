import type { MetadataRoute } from 'next'

const siteUrl = 'https://toeic-quiz-touch-jpn.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
