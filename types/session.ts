export interface SessionStats {
  correct: number
  incorrect: number
  total: number
  accuracy: number
  wordsReviewed: Array<{
    korean: string
    english: string
    isCorrect: boolean
    userAnswer: string | null
  }>
  startTime: number
  endTime?: number
  duration?: number
}
