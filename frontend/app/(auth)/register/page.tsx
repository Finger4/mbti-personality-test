use client
import { useState } from react
import Link from next/link
import { useRouter } from next/navigation
import { fetchAPI } from @/lib/utils
import { useAuthStore } from @/lib/store
import Navbar from @/components/Navbar
import Footer from @/components/Footer

function passwordToLevel(pwd: string): { level: number; color: string; text: string } {
  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[a-z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  if (score <= 2) return { level: 1, color: bg-red-500, text: 弱 }
  if (score <= 4) return { level: 2, color: bg-yellow-500, text: 中 }
  return { level: 3, color: bg-green-500, text: 强 }
}

const REQUIREMENTS = [
  { label: 至少 8 位, ok: (p: string) => p.length >= 8 },
  { label: 包含大写字母, ok: (p: string) => /[A-Z]/.test(p) },
  { label: 包含小写字母, ok: (p: string) => /[a-z]/.test(p) },
  { label: 包含数字, ok: (p: string) => /[0-9]/.test(p) },
  { label: 包含特殊字符, ok: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export default function RegisterPage() {
  const [username, setUsername] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirmPwd, setConfirmPwd] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const pwdLevel = passwordToLevel(password)
  const allOk = REQUIREMENTS.every((r) => r.ok(password))
  const pwdMatch = confirmPwd && password === confirmPwd
  const pwdMismatch = confirmPwd && password !== confirmPwd

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!allOk) {
      setError(请符合密码要求)
      return
    }
    if (password !== confirmPwd) {
      setError(两次密码不一致)
      return
    }
    setLoading(true)
    setError()
    try {
      const data = await fetchAPI(/api/register, {
        method: POST,
        body: JSON.stringify({ username, email, password }),
      })
      const payload = JSON.parse(atob(data.access_token.split(.)[1]))
      setAuth(data.access_token, { id: payload.sub, username, email, is_admin: false })
      router.push(/)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=min-h-screen flex flex-col bg-gray-50>
      <Navbar />
      <div className=flex-1 flex items-center justify-center px-4>
        <div className=w-full max-w-md>
          <div className=text-center mb-8>
            <Link href=/ className=inline-flex items-center gap-2 mb-6>
              <div className=w-10 h-10 mbti-gradient rounded-xl flex items-center justify-center text-white font-bold>M</div>
            </Link>
            <h1 className=text-2xl font-heading font-bold>创建账号</h1>
            <p className=text-gray-500 mt-1>开始你的 MBTI 探索之旅</p>
          </div>
          <form onSubmit={handleSubmit} className=bg-white rounded-2xl shadow-sm p-8>
            {error && <div className=mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg>{error}</div>}
            <div className=mb-4>
              <label className=block text-sm font-medium text-gray-700 mb-1>用户名</label>
              <input type=text value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} className=w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder=yourname />
            </div>
            <div className=mb-4>
              <label className=block text-sm font-medium text-gray-700 mb-1>邮箱</label>
              <input type=email value={email} onChange={(e) => setEmail(e.target.value)} required className=w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder=your@email.com />
            </div>
            <div className=mb-2>
              <label className=block text-sm font-medium text-gray-700 mb-1>密码</label>
              <input type=password value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className=w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder=设置密码 />
            </div>
            {password && (
              <div className=mb-3>
                <div className=flex gap-1 mb-1>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={h-1 flex-1 rounded-full  + (i <= pwdLevel.level ? pwdLevel.color : bg-gray-200)} />
                  ))}
                </div>
                <div className=flex items-center justify-between text-xs>
                  <span className={pwdLevel.level >= 3 ? text-green-600 : pwdLevel.level === 2 ? text-yellow-600 : text-red-600}>
                    强度：{pwdLevel.text}
                  </span>
                </div>
              </div>
            )}
            {password && (
              <div className=mb-4 grid grid-cols-2 gap-1>
                {REQUIREMENTS.map((r) => (
                  <div key={r.label} className={flex items-center gap-1 text-xs  + (r.ok(password) ? text-green-600 : text-gray-400)}>
                    <span>{r.ok(password) ? ✓ : ○}</span>
                    <span>{r.label}</span>
                  </div>
                ))}
              </div>
            )}
            <div className=mb-6>
              <label className=block text-sm font-medium text-gray-700 mb-1>确认密码</label>
              <input type=password value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} required minLength={8} className={w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none  + (pwdMismatch ? border-red-400 : border-gray-200)} placeholder=再次输入密码 />
              {pwdMismatch && <p className=mt-1 text-xs text-red-500>两次密码不一致</p>}
              {pwdMatch && <p className=mt-1 text-xs text-green-500>✓ 密码一致</p>}
            </div>
            <button type=submit disabled={loading || !allOk || !pwdMatch} className=w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors>
              {loading ? 注册中... : 免费注册}
            </button>
            <div className=mt-4 text-center text-sm text-gray-500>
              已有账号？<Link href=/login className=text-blue-600 hover:underline>登录</Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}
