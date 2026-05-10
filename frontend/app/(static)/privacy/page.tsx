import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 mbti-gradient rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="font-heading font-bold">MBTI 测试</span>
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">返回首页</Link>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-heading font-bold mb-8">隐私政策</h1>
        <div className="prose max-w-none text-gray-600 space-y-4">
          <p>您的隐私对我们非常重要。本隐私政策说明了我们会收集哪些信息、如何使用以及保护您的个人信息。</p>
          <h2 className="text-xl font-semibold text-gray-900">信息收集</h2>
          <p>我们收集您主动提供的信息，包括测试答案、账号信息（邮箱、用户名）等。</p>
          <h2 className="text-xl font-semibold text-gray-900">信息使用</h2>
          <p>您的信息用于提供测试服务、生成性格分析报告，以及改善用户体验。</p>
          <h2 className="text-xl font-semibold text-gray-900">信息保护</h2>
          <p>我们采用行业标准的安全措施保护您的个人信息不被未授权访问或泄露。</p>
          <h2 className="text-xl font-semibold text-gray-900">联系我们</h2>
          <p>如有任何问题，请通过网站上的联系方式与我们联系。</p>
        </div>
      </div>
    </div>
  )
}
