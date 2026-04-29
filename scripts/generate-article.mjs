import { writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = join(__dirname, '..', 'src', 'content', 'blog')
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const themes = [
  'TOEICに頻出するビジネスメールの英単語10選',
  'TOEICに出る「会議」関連の英単語10選',
  'TOEICに出る「契約・法律」関連の英単語10選',
  'TOEICに出る「人事・採用」関連の英単語10選',
  'TOEICに出る「経営・財務」関連の英単語10選',
  'TOEICに出る「マーケティング」関連の英単語10選',
  'TOEICに出る「物流・配送」関連の英単語10選',
  'TOEICに出る「旅行・出張」関連の英単語10選',
  'TOEICに出る「医療・健康」関連の英単語10選',
  'TOEICに出る「テクノロジー」関連の英単語10選',
  'TOEICに出る「不動産・施設」関連の英単語10選',
  'TOEICに出る「顧客対応」関連の英単語10選',
  '英単語の効率的な覚え方：TOEICスコアを上げるコツ',
  'TOEIC600点突破に必要な英単語の特徴とは',
  'TOEIC730点を目指す人が押さえるべき英単語リスト',
  'TOEIC860点レベルの難単語を攻略する方法',
  '紛らわしいTOEIC英単語の違いを徹底解説',
  'TOEICパート5で狙われる英単語の傾向と対策',
  'ビジネスシーンで使えるTOEIC英単語フレーズ集',
  '金フレで学ぶTOEIC頻出動詞10選と例文',
]

function pickTheme() {
  const existing = readdirSync(BLOG_DIR).map(f => f.replace('.json', ''))
  const unused = themes.filter((_, i) => !existing.includes(String(i).padStart(3, '0')))
  if (unused.length === 0) return { theme: themes[Math.floor(Math.random() * themes.length)], index: existing.length }
  const index = themes.indexOf(unused[0])
  return { theme: unused[0], index }
}

async function generateArticle(theme) {
  const prompt = `あなたはTOEIC英語学習の専門家です。以下のテーマでブログ記事を書いてください。

テーマ：${theme}

以下のJSON形式で返してください（JSONのみ、他のテキストは不要）：
{
  "title": "記事タイトル",
  "excerpt": "記事の要約（100文字以内）",
  "content": "記事本文（HTML形式、h2/h3/p/ul/liタグを使用、2000文字程度）"
}

記事の要件：
- TOEIC受験者・英語学習者向け
- 具体的な英単語と例文を含む
- 実践的で役立つ内容
- 自然な日本語で書く
- RIZAPイングリッシュなどの英語学習サービスへの言及を自然に1〜2箇所入れる`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    }
  )

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('JSON not found in response')
  return JSON.parse(jsonMatch[0])
}

async function main() {
  const { theme, index } = pickTheme()
  console.log(`生成中: ${theme}`)

  const article = await generateArticle(theme)
  const date = new Date().toISOString().split('T')[0]
  const slug = `${date}-${String(index).padStart(3, '0')}`

  const post = {
    slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    date,
    theme,
  }

  const filePath = join(BLOG_DIR, `${slug}.json`)
  writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf-8')
  console.log(`記事を保存しました: ${filePath}`)
}

main().catch(e => { console.error(e); process.exit(1) })
