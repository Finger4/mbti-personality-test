import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  username: string
  email: string
  is_admin: boolean
}

interface AuthState {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "mbti-auth" }
  )
)

interface TestState {
  answers: Record<string, string>  // question_id -> "A" or "B"
  currentQuestion: number
  startTime: number | null
  setAnswer: (qid: string, option: string) => void
  nextQuestion: () => void
  prevQuestion: () => void
  setCurrentQuestion: (n: number) => void
  startTest: () => void
  resetTest: () => void
}

export const useTestStore = create<TestState>((set, get) => ({
  answers: {},
  currentQuestion: 0,
  startTime: null,
  setAnswer: (qid, option) => set((s) => ({ answers: { ...s.answers, [qid]: option } })),
  nextQuestion: () => set((s) => ({ currentQuestion: s.currentQuestion + 1 })),
  prevQuestion: () => set((s) => ({ currentQuestion: Math.max(0, s.currentQuestion - 1) })),
  setCurrentQuestion: (n) => set({ currentQuestion: n }),
  startTest: () => set({ answers: {}, currentQuestion: 0, startTime: Date.now() }),
  resetTest: () => set({ answers: {}, currentQuestion: 0, startTime: null }),
}))
