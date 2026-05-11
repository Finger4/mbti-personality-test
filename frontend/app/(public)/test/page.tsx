"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTestStore } from "@/lib/store"
import { useAuthStore } from "@/lib/store"
import { fetchAPI } from "@/lib/utils"
import type { Question } from "@/types"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function TestPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [resultId, setResultId] = useState<string | null>(null)
  const { answers, currentQuestion, setAnswer, nextQuestion, prevQuestion, setCurrentQuestion, startTest, startTime } = useTestStore()
  const { token } = useAuthStore()

  useEffect(() => {
    startTest()
    fetchAPI("/api/questions").then((data) => {
      setQuestions(data)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [])

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert("请回答所有问题")
      return
    }
    setSubmitting(true)
    const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0
    try {
      const headers: Record<string, string> = {}
      if (token) headers["Authorization"] = `Bearer ${token}`
      const res = await fetchAPI("/api/submit", {
        method: "POST",
        headers,
        body: JSON.stringify({
          answers: Object.entries(answers).map(([question_id, chosen_option]) => ({ question_id, chosen_option })),
          duration_seconds: duration,
        }),
      })
      setResultId(res.result_id)
    } catch (e: any) {
      alert(e.message)
      setSubmitting(false)
    }
  }

  if (resultId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-heading font-bold mb-4">测试完成！</h1>
            <p className="text-gray-600 mb-6">正在跳转到你的结果...</p>
            <Link href={"/result/" + resultId} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              查看结果
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">加载题目中...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const q = questions[currentQuestion]

  if (!q) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-5xl mb-4">😔</div>
            <h2 className="text-xl font-heading font-bold mb-2">题目加载失败</h2>
            <p className="text-gray-500 mb-6">无法加载测试题目，请检查网络后重试</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
              重新加载
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const allAnswered = Object.keys(answers).length === questions.length
  const isLastQuestion = currentQuestion === questions.length - 1
  const canSubmit = isLastQuestion && allAnswered

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">第 {currentQuestion + 1} / {questions.length} 题</span>
            <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: progress + "%" }}></div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="mb-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
              {q.dimension === "EI" ? "外向-内向" : q.dimension === "SN" ? "感觉-直觉" : q.dimension === "TF" ? "思考-情感" : "判断-知觉"}
            </span>
          </div>
          <h2 className="text-xl font-heading font-semibold mb-8">{q.content}</h2>
          <div className="space-y-4">
            <button
              onClick={() => setAnswer(q.id, "A")}
              className={"w-full p-4 rounded-xl text-left transition-all border-2 " + (answers[q.id] === "A" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-white")}
            >
              <span className={"inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 text-sm font-medium " + (answers[q.id] === "A" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600")}>A</span>
              {q.option_a}
            </button>
            <button
              onClick={() => setAnswer(q.id, "B")}
              className={"w-full p-4 rounded-xl text-left transition-all border-2 " + (answers[q.id] === "B" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-white")}
            >
              <span className={"inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 text-sm font-medium " + (answers[q.id] === "B" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600")}>B</span>
              {q.option_b}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-4 py-2 text-gray-600 font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:text-gray-900"
          >
            ← 上一题
          </button>
          <div className="flex gap-1">
            {questions.slice(Math.max(0, currentQuestion - 2), currentQuestion).map((_, i) => (
              <button key={i} onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 3 + i))} className="w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-400" />
            ))}
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            {questions.slice(currentQuestion + 1, Math.min(questions.length, currentQuestion + 3)).map((_, i) => (
              <button key={i} onClick={() => setCurrentQuestion(currentQuestion + 1 + i)} className="w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-400" />
            ))}
          </div>
          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className={"px-6 py-2 rounded-lg font-medium transition-colors " + (canSubmit ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed")}
            >
              {submitting ? "提交中..." : "提交测试"}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={!answers[q.id]}
              className="px-4 py-2 text-blue-600 font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:text-blue-700"
            >
              下一题 →
            </button>
          )}
        </div>

        {/* Question nav dots - 15 per row, 4 rows max */}
        <div className="mt-6 max-w-[600px] mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-1">
            {questions.map((qq, i) => (
              <button
                key={qq.id}
                onClick={() => setCurrentQuestion(i)}
                className={"w-[33px] h-[33px] rounded text-xs font-medium transition-colors flex items-center justify-center " + (i === currentQuestion ? "bg-blue-600 text-white" : answers[qq.id] ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500 hover:bg-gray-300")}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
