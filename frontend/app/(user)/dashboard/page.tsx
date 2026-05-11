"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { fetchAPI } from "@/lib/utils"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
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
      <Footer />
    </div>
  )
}
