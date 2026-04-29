'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import wordsData from '@/data/words.json'
import type { Word, Question, QuizMode, Level } from '@/types'

const words = wordsData as Word[]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuestions(mode: QuizMode, level: Level, count: number): Question[] {
  const pool = level === 'all' ? words : words.filter((w) => w.level === level)
  const selected = shuffle(pool).slice(0, count)

  return selected.map((word) => {
    const others = shuffle(pool.filter((w) => w.id !== word.id)).slice(0, 4)
    const correctAnswer = mode === 'en-ja' ? word.meaning : word.word
    const wrongAnswers = others.map((w) => (mode === 'en-ja' ? w.meaning : w.word))
    const allChoices = shuffle([correctAnswer, ...wrongAnswers])
    return {
      word,
      choices: allChoices,
      correctIndex: allChoices.indexOf(correctAnswer),
    }
  })
}

function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = (searchParams.get('mode') ?? 'en-ja') as QuizMode
  const level = (searchParams.get('level') ?? 'all') as Level
  const count = Number(searchParams.get('count') ?? 20)

  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<boolean[]>([])

  useEffect(() => {
    setQuestions(buildQuestions(mode, level, count))
  }, [mode, level, count])

  const handleSelect = useCallback(
    (index: number) => {
      if (selected !== null) return
      setSelected(index)
      setAnswers((prev) => [...prev, index === questions[current].correctIndex])
    },
    [selected, questions, current]
  )

  const handleNext = useCallback(() => {
    if (current + 1 >= questions.length) {
      const correct = [...answers, selected === questions[current].correctIndex].filter(Boolean).length
      const params = new URLSearchParams({
        correct: String(correct),
        total: String(questions.length),
        mode,
        level,
        count: String(count),
      })
      router.push(`/result?${params.toString()}`)
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
    }
  }, [current, questions, answers, selected, router, mode, level, count])

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500 text-lg">問題を生成中...</p>
      </div>
    )
  }

  const q = questions[current]
  const isAnswered = selected !== null
  const isCorrect = selected === q.correctIndex

  const choiceStyle = (i: number) => {
    if (!isAnswered) {
      return 'border-gray-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 cursor-pointer'
    }
    if (i === q.correctIndex) {
      return 'border-green-500 bg-green-50 text-green-700 font-semibold'
    }
    if (i === selected) {
      return 'border-red-400 bg-red-50 text-red-600'
    }
    return 'border-gray-200 bg-gray-50 text-gray-400'
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ← ホームに戻る
          </button>
          <span className="text-sm font-medium text-gray-500">
            {current + 1} / {questions.length}
          </span>
          <span className="text-sm font-medium text-indigo-600">
            {mode === 'en-ja' ? '英→日' : '日→英'}
          </span>
        </div>

        {/* プログレスバー */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* 問題カード */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">
            {mode === 'en-ja' ? '次の英単語の意味を選べ' : '次の日本語に対応する英単語を選べ'}
          </p>
          <p className="text-3xl font-bold text-gray-800 text-center py-4">
            {mode === 'en-ja' ? q.word.word : q.word.meaning}
          </p>
          {q.word.level && (
            <p className="text-center text-xs text-gray-400 mt-2">TOEIC {q.word.level}</p>
          )}
        </div>

        {/* 選択肢 */}
        <div className="space-y-3 mb-6">
          {q.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left py-4 px-5 rounded-xl border-2 transition-all duration-150 ${choiceStyle(i)}`}
            >
              <span className="font-semibold mr-3 text-gray-400">
                {['A', 'B', 'C', 'D', 'E'][i]}.
              </span>
              {choice}
            </button>
          ))}
        </div>

        {/* 答え合わせ＋例文 */}
        {isAnswered && (
          <div
            className={`rounded-2xl p-6 mb-6 border-2 ${
              isCorrect ? 'border-green-400 bg-green-50' : 'border-red-300 bg-red-50'
            }`}
          >
            <p className={`text-xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
              {isCorrect ? '✅ 正解！' : `❌ 不正解  正解：${q.choices[q.correctIndex]}`}
            </p>
            <div className="text-sm space-y-2">
              <p className="font-semibold text-gray-600">例文</p>
              <p className="text-gray-700 leading-relaxed">{q.word.example}</p>
              <p className="text-gray-500 leading-relaxed">{q.word.exampleJa}</p>
            </div>
          </div>
        )}

        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl transition-colors"
          >
            {current + 1 >= questions.length ? '結果を見る 🏁' : '次の問題 →'}
          </button>
        )}
      </div>
    </main>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    }>
      <QuizContent />
    </Suspense>
  )
}
