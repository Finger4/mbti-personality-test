"use client"
import Link from "next/link"
import { useAuthStore } from "@/lib/store"

export default function Navbar() {
  const { user } = useAuthStore()

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 mbti-gradient rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="font-heading font-bold text-lg">MBTI 性格测试</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm font-medium text-blue-600">{user.email}</span>
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">我的主页</Link>
              <Link href="/test" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">开始测试</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">登录</Link>
              <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">免费注册</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
