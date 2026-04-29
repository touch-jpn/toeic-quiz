export type Level = 'all' | '600点' | '730点' | '860点'
export type QuizMode = 'en-ja' | 'ja-en'

export interface Word {
  id: number
  level: string
  cefr: string
  word: string
  meaning: string
  example: string
  exampleJa: string
}

export interface Question {
  word: Word
  choices: string[]
  correctIndex: number
}

export interface QuizConfig {
  mode: QuizMode
  level: Level
  count: number
}
