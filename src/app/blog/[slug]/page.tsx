import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const BLOG_DIR = join(process.cwd(), 'src', 'content', 'blog')

interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
}

function getPost(slug: string): Post | null {
  try {
    const raw = readFileSync(join(BLOG_DIR, `${slug}.json`), 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function generateStaticParams() {
  try {
    return readdirSync(BLOG_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => ({ slug: f.replace('.json', '') }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/blog" className="text-indigo-500 hover:underline text-sm">← 記事一覧</Link>
      </div>

      <article className="bg-white rounded-2xl shadow p-8">
        <p className="text-xs text-gray-400 mb-3">{post.date}</p>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{post.title}</h1>
        <div
          className="prose prose-indigo max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-block py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
        >
          英単語クイズに挑戦する 🚀
        </Link>
      </div>
    </main>
  )
}
