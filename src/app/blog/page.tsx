import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ブログ｜TOEIC英単語・英語学習コラム',
  description: 'TOEICに役立つ英単語や英語学習のコツをまとめたコラム記事一覧です。',
}

interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
}

function getPosts(): Post[] {
  const dir = join(process.cwd(), 'src', 'content', 'blog')
  try {
    const files = readdirSync(dir).filter(f => f.endsWith('.json'))
    return files
      .map(f => {
        const raw = readFileSync(join(dir, f), 'utf-8')
        const { slug, title, excerpt, date } = JSON.parse(raw)
        return { slug, title, excerpt, date }
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  } catch {
    return []
  }
}

export default function BlogPage() {
  const posts = getPosts()

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="text-indigo-500 hover:underline text-sm">← クイズに戻る</Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">TOEIC英語学習コラム</h1>
        <p className="text-gray-500 mt-2">TOEICに役立つ英単語・学習法をお届けします</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-400">記事を準備中です。しばらくお待ちください。</p>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
                <p className="text-xs text-gray-400 mb-2">{post.date}</p>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>
                <p className="text-indigo-500 text-sm mt-3">続きを読む →</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
