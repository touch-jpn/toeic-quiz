'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Level, QuizMode } from '@/types'

export default function Home() {
  const router = useRouter()
  const [mode, setMode] = useState<QuizMode>('en-ja')
  const [level, setLevel] = useState<Level>('all')
  const [count, setCount] = useState(20)

  const start = () => {
    const params = new URLSearchParams({ mode, level, count: String(count) })
    router.push(`/quiz?${params.toString()}`)
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">TOEIC 英単語クイズ</h1>
          <p className="text-gray-500">金フレレベル 1500語 5択クイズ</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* モード選択 */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-3">出題モード</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('en-ja')}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  mode === 'en-ja'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-500 hover:border-indigo-300'
                }`}
              >
                英語 → 日本語
              </button>
              <button
                onClick={() => setMode('ja-en')}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  mode === 'ja-en'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-500 hover:border-indigo-300'
                }`}
              >
                日本語 → 英語
              </button>
            </div>
          </div>

          {/* レベル選択 */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-3">レベル</label>
            <div className="grid grid-cols-2 gap-3">
              {(['all', '600点', '730点', '860点'] as Level[]).map((lv) => (
                <button
                  key={lv}
                  onClick={() => setLevel(lv)}
                  className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                    level === lv
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-500 hover:border-indigo-300'
                  }`}
                >
                  {lv === 'all' ? '全レベル' : `TOEIC ${lv}`}
                </button>
              ))}
            </div>
          </div>

          {/* 問題数 */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-3">
              問題数：<span className="text-indigo-600 text-lg">{count}問</span>
            </label>
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10問</span>
              <span>50問</span>
            </div>
          </div>

          <button
            onClick={start}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl transition-colors shadow-md"
          >
            クイズスタート 🚀
          </button>
        </div>
      </div>
    </main>
  )
}
