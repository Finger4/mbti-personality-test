import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <section className="flex-1 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">简单透明的定价</h1>
          <p className="text-xl text-gray-500 mb-12">先免费测试，再决定是否需要深度分析</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <div className="text-center mb-6">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">免费</span>
                <div className="text-4xl font-bold mt-4">¥0</div>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center gap-2"><span className="text-green-500">✅</span> 60道测试题目</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✅</span> MBTI性格类型判定</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✅</span> 基础雷达图</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✅</span> 一句话性格描述</li>
                <li className="flex items-center gap-2 text-gray-400"><span>❌</span> 四维度深度解读</li>
                <li className="flex items-center gap-2 text-gray-400"><span>❌</span> 个性化职业建议</li>
                <li className="flex items-center gap-2 text-gray-400"><span>❌</span> 人际匹配分析</li>
                <li className="flex items-center gap-2 text-gray-400"><span>❌</span> 可分享结果卡片</li>
              </ul>
              <Link className="block w-full py-3 text-center border-2 border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50" href="/test">免费测试</Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white border-2 border-blue-500 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-full">🔥 深度分析</span>
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold mt-2 text-blue-600">¥9.9</div>
                <p className="text-gray-400 text-sm mt-1">一次付费，终身查看</p>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center gap-2"><span className="text-green-500">✅</span> 全部免费功能</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">✅</span> 四维度深度解读</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">✅</span> 个性化职业建议</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">✅</span> 人际匹配分析</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">✅</span> 可分享结果卡片</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">✅</span> 登录后永久保存</li>
              </ul>
              <Link className="block w-full py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90" href="/test">测试后解锁</Link>
            </div>
          </div>

          <div className="mt-12 text-gray-500 text-sm">
            <p>💳 所有支付通过微信支付安全加密处理</p>
            <p className="mt-2">📧 付费后如有问题联系 Finger4@foxmail.com</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
