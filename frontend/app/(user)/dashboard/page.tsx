"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { fetchAPI } from "@/lib/utils"

export default function DashboardPage() {
  const { user, token, logout } = useAuthStore()
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
            <span className="text-sm text-gray-600">欢迎，{user.username}</span>
            <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">退出</button>
          </div>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-heading font-bold mb-8">我的主页</h1>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold mb-4">快速开始</h2>
            <Link href="/test" className="inline-block px-6 py-3 mbti-gradient text-white rounded-xl font-medium hover:opacity-90">
              开始新的测试
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold mb-4">账号信息</h2>
            <p className="text-sm text-gray-600 mb-1">用户名：{user.username}</p>
            <p className="text-sm text-gray-600 mb-1">邮箱：{user.email}</p>
            <p className="text-sm text-gray-600">角色：{user.is_admin ? "管理员" : "普通用户"}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-heading font-semibold mb-4">测试历史</h2>
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>还没有测试记录</p>
              <Link href="/test" className="text-blue-600 hover:underline mt-2 inline-block">去做第一次测试</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((r) => (
                <Link key={r.id} href={`/result/${r.id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-lg">{r.type}</span>
                    <span className="text-sm text-gray-500">{r.created_at?.split("T")[0]}</span>
                  </div>
                  <span className="text-blue-600 text-sm">查看结果 →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
