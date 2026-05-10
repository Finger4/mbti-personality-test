"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { fetchAPI } from "@/lib/utils"

export default function AdminPage() {
  const { user, token } = useAuthStore()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"dashboard"|"questions"|"users"|"contacts">("dashboard")

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    if (!user.is_admin) { router.push("/"); return }
    if (token) {
      fetchAPI("/api/admin/dashboard", { headers: { Authorization: `Bearer ${token}` } })
        .then(setStats)
        .catch(() => {})
    }
  }, [user, token])

  if (!user || !user.is_admin) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 mbti-gradient rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="font-heading font-bold">管理后台</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">返回主页</Link>
            <span className="text-sm text-red-600 font-medium">管理员</span>
          </div>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
          {(["dashboard","questions","users","contacts"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
              {tab === "dashboard" ? "数据概览" : tab === "questions" ? "题目管理" : tab === "users" ? "用户管理" : "留言管理"}
            </button>
          ))}
        </div>

        {activeTab === "dashboard" && stats && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">总用户数</p>
              <p className="text-3xl font-bold">{stats.total_users}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">人格类型分布</p>
              <div className="space-y-1 mt-2">
                {stats.type_distribution?.slice(0,5).map((t: any) => (
                  <div key={t.type} className="flex justify-between text-sm">
                    <span className="font-mono">{t.type}</span>
                    <span className="text-gray-500">{t.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">最近测试</p>
              <div className="space-y-1 mt-2">
                {stats.recent_tests?.slice(0,5).map((r: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="font-mono">{r.type}</span>
                    <span className="text-gray-400 text-xs">{r.at?.split("T")[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "questions" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">题目管理功能开发中（需要后端数据库连接）</p>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">用户管理功能开发中（需要后端数据库连接）</p>
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">留言管理功能开发中（需要后端数据库连接）</p>
          </div>
        )}
      </div>
    </div>
  )
}
