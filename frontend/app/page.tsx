"use client"
import StatsWidget from "@/components/StatsWidget"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuthStore } from "@/lib/store"

export default function Home() {
  const { user } = useAuthStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 mbti-gradient rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="font-heading font-bold text-lg">MBTI 性格测试</span>
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

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mbti-gradient opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 py-20 text-center relative">
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full mb-4">
              🧠 超过 100 万人已测试
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              发现你的 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">真实性格</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              基于 MBTI 十六型人格理论，60道科学题目，深入解读你的性格密码
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/test" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-medium hover:opacity-90 hover:shadow-lg transition-all">
                🎯 立即开始免费测试
              </Link>
              <Link href="/pricing" className="px-8 py-4 bg-white text-gray-700 rounded-xl text-lg font-medium border border-gray-200 hover:bg-gray-50 transition-all">
                了解付费深度分析
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-3">简单透明的定价</h2>
          <p className="text-gray-500 text-center mb-10">先免费测试，再决定是否需要深度分析</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free tier */}
            <div className="border-2 border-gray-200 rounded-2xl p-8">
              <div className="text-center mb-6">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">免费</span>
                <div className="text-4xl font-bold mt-4">¥0</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-green-500">✅</span> 60道测试题目
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-green-500">✅</span> MBTI性格类型判定
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-green-500">✅</span> 基础雷达图
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-green-500">✅</span> 一句话性格描述
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span>❌</span> 深度维度解读
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span>❌</span> 职业发展建议
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span>❌</span> 人际匹配分析
                </li>
              </ul>
              <Link href="/test" className="block w-full py-3 text-center border-2 border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50">
                免费测试
              </Link>
            </div>

            {/* Premium tier */}
            <div className="border-2 border-blue-500 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-full">
                  🔥 深度分析
                </span>
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold mt-2 text-blue-600">¥9.9</div>
                <p className="text-gray-400 text-sm mt-1">一次付费，终身查看</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-green-500">✅</span> 全部免费功能
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-blue-500">✅</span> 四维度深度解读
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-blue-500">✅</span> 个性化职业建议
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-blue-500">✅</span> 人际匹配分析
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-blue-500">✅</span> 可分享结果卡片
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="text-blue-500">✅</span> 登录后永久保存
                </li>
              </ul>
              <Link href="/test" className="block w-full py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90">
                测试后解锁
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 16 Types */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">探索 16 种人格类型</h2>
          <p className="text-gray-500 mb-8">每个类型都有独特的优势和魅力</p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {["INTJ","INTP","ENTJ","ENTP","INFJ","INFP","ENFJ","ENFP","ISTJ","ISFJ","ESTJ","ESFJ","ISTP","ISFP","ESTP","ESFP"].map((t) => (
              <Link key={t} href="/test" className="p-3 bg-white rounded-xl text-center font-mono text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-100">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-8">他们都在用</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "职业规划", desc: "找工作前做了测试，明确了自己的职业方向", icon: "💼" },
              { name: "自我认知", desc: "终于理解为什么总在社交场合感到疲惫了", icon: "🧠" },
              { name: "人际关系", desc: "和室友的矛盾居然是人格差异，了解之后和解了", icon: "💕" },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-2xl">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600">"{item.desc}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">准备好了解真正的自己了吗？</h2>
          <p className="text-gray-500 mb-8">10分钟，开启自我发现的旅程</p>
          <Link href="/test" className="inline-block px-10 py-4 mbti-gradient text-white rounded-xl text-lg font-medium hover:opacity-90">
            🎯 开始 MBTI 测试
          </Link>
        </div>
      </section>

      {/* Stats Widget */}
      <StatsWidget />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2024 MBTI 性格测试. 仅供娱乐参考.</p>
        </div>
      </footer>
    </div>
  )
}
