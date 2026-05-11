"use client"
import { useState } from "react"
import Link from "next/link"
import { fetchAPI } from "@/lib/utils"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", content: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await fetchAPI("/api/contact/submit", { method: "POST", body: JSON.stringify(form) })
      setSuccess(true)
      setForm({ name: "", email: "", subject: "", content: "" })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-heading font-bold mb-2">联系我们</h1>
        <p className="text-gray-500 mb-8">有任何问题或建议？我们很乐意听到您的声音。</p>
        {success ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-semibold mb-2">发送成功！</h2>
            <p className="text-gray-500">感谢您的留言，我们会尽快回复。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">主题</label>
              <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">内容（至少20字）</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required minLength={20} rows={5} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
              {loading ? "发送中..." : "发送留言"}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  )
}
