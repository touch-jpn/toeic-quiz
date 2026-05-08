'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function ResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const correct = Number(searchParams.get('correct') ?? 0)
  const total = Number(searchParams.get('total') ?? 1)
  const mode = searchParams.get('mode') ?? 'en-ja'
  const level = searchParams.get('level') ?? 'all'
  const count = searchParams.get('count') ?? '20'

  const pct = Math.round((correct / total) * 100)

  const rank = () => {
    if (pct >= 90) return { label: '🏆 パーフェクト！', color: 'text-yellow-500' }
    if (pct >= 70) return { label: '🎉 よくできました！', color: 'text-green-600' }
    if (pct >= 50) return { label: '💪 もう少し！', color: 'text-blue-600' }
    return { label: '📖 復習しよう', color: 'text-red-500' }
  }

  const { label, color } = rank()

  const retry = () => {
    const params = new URLSearchParams({ mode, level, count })
    router.push(`/quiz?${params.toString()}`)
  }

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-4 overflow-x-hidden">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">クイズ終了！</h1>

          {/* 円グラフ風スコア */}
          <div className="relative flex items-center justify-center my-4">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="12" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#6366f1"
                strokeWidth="12"
                strokeDasharray={`${pct * 3.14159} 314.159`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold text-indigo-600">{pct}%</span>
              <span className="text-sm text-gray-400">{correct}/{total}問</span>
            </div>
          </div>

          <p className={`text-2xl font-bold ${color}`}>{label}</p>

          <div className="text-sm text-gray-500 space-y-1">
            <p>モード：{mode === 'en-ja' ? '英語 → 日本語' : '日本語 → 英語'}</p>
            <p>レベル：{level === 'all' ? '全レベル' : `TOEIC ${level}`}</p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={retry}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
            >
              同じ設定でもう一度
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 border-2 border-gray-200 hover:border-indigo-300 text-gray-600 font-bold rounded-xl transition-colors"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    }>
      <ResultContent />
    </Suspense>
  )
}
