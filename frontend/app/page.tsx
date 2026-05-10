"use client"
import Link from "next/link"
import { useAuthStore } from "@/lib/store"

export default function Home() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 mbti-gradient rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="font-heading font-bold text-lg">MBTI 测试</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">我的主页</Link>
                <Link href="/history" className="text-sm font-medium text-gray-600 hover:text-gray-900">测试记录</Link>
                {user.is_admin && <Link href="/admin" className="text-sm font-medium text-blue-600 hover:text-blue-700">管理后台</Link>}
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
        <div className="absolute inset-0 mbti-gradient opacity-5"></div>
        <div className="max-w-6xl mx-auto px-4 py-24 text-center relative">
          <h1 className="text-5xl font-heading font-bold mb-6 text-balance">
            发现你的 <span className="text-blue-600">真实性格</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            基于 MBTI 十六型人格理论，通过 60 道科学题目，深入了解你的性格特点、职场优势和人际关系模式。
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/test" className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 transition-all hover:shadow-lg">
              立即开始测试
            </Link>
            <Link href="/about" className="px-8 py-4 bg-white text-gray-700 rounded-xl text-lg font-medium hover:bg-gray-50 transition-all border border-gray-200">
              了解更多
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">免费 · 约 10 分钟 · 立即获取结果</p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">为什么选择我们的 MBTI 测试？</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🎯", title: "科学精准", desc: "基于 MBTI 原版理论，60道题目覆盖四大维度，科学评估你的性格类型。" },
              { icon: "📊", title: "深度分析", desc: "不仅给出类型，更提供维度分析、职业建议、兼容性解读等丰富内容。" },
              { icon: "🔒", title: "隐私保护", desc: "你的测试记录和个人信息受到严格保护，不会与任何第三方共享。" },
            ].map((f, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-gray-50 card-hover">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-heading font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 16 Types Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-4">探索 16 种人格类型</h2>
          <p className="text-gray-600 text-center mb-12">每个类型都有独特的优势和特点</p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {["INTJ","INTP","ENTJ","ENTP","INFJ","INFP","ENFJ","ENFP","ISTJ","ISFJ","ESTJ","ESFJ","ISTP","ISFP","ESTP","ESFP"].map((t) => (
              <Link key={t} href={`/test`} className="p-3 bg-white rounded-xl text-center font-mono text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-100">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">准备好了解真正的自己了吗？</h2>
          <p className="text-gray-600 mb-8">10分钟，开启自我发现的旅程</p>
          <Link href="/test" className="inline-block px-10 py-4 mbti-gradient text-white rounded-xl text-lg font-medium hover:opacity-90 transition-opacity">
            开始 MBTI 测试
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2024 MBTI 性格测试. 仅供娱乐参考.</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Link href="/privacy" className="hover:text-gray-700">隐私政策</Link>
            <Link href="/contact" className="hover:text-gray-700">联系我们</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
