"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { fetchAPI } from "@/lib/utils"

export default function HistoryPage() {
  const { user, token } = useAuthStore()
  const router = useRouter()
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    if (token) {
      fetchAPI("/api/user/results", { headers: { Authorization: `Bearer ${token}` } })
        .then(setHistory)
        .catch(() => {})
    }
  }, [user, token])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 mbti-gradient rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="font-heading font-bold">MBTI 测试</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">我的主页</Link>
            <Link href="/test" className="text-sm text-blue-600 hover:text-blue-700">开始测试</Link>
          </div>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-heading font-bold mb-8">测试记录</h1>
        {history.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 mb-4">还没有测试记录</p>
            <Link href="/test" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 inline-block">去做测试</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((r) => (
              <Link key={r.id} href={`/result/${r.id}`} className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center">
                      <span className="font-mono font-bold text-xl text-blue-600">{r.type}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{r.type}</p>
                      <p className="text-sm text-gray-500">{r.created_at?.replace("T", " ").split(".")[0]}</p>
                    </div>
                  </div>
                  <span className="text-blue-600">查看 →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
