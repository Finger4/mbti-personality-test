"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { fetchAPI } from "@/lib/utils"
import { useAuthStore } from "@/lib/store"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const data = await fetchAPI("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      })
      const payload = JSON.parse(atob(data.access_token.split(".")[1]))
      setAuth(data.access_token, { id: payload.sub, username, email, is_admin: false })
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 mbti-gradient rounded-xl flex items-center justify-center text-white font-bold">M</div>
          </Link>
          <h1 className="text-2xl font-heading font-bold">创建账号</h1>
          <p className="text-gray-500 mt-1">开始你的 MBTI 探索之旅</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="yourname" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="your@email.com" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="至少8位" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? "注册中..." : "免费注册"}
          </button>
          <div className="mt-4 text-center text-sm text-gray-500">
            已有账号？<Link href="/login" className="text-blue-600 hover:underline">登录</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
