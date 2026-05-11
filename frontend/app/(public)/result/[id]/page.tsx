"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { fetchAPI } from "@/lib/utils"
import { useAuthStore } from "@/lib/store"
import PaywallModal from "@/components/PaywallModal"
import type { TestResult } from "@/types"
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function ResultPage() {
  const params = useParams()
  const [result, setResult] = useState<TestResult | null>(null)
  const [basicResult, setBasicResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showPaywall, setShowPaywall] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const { token } = useAuthStore()

  useEffect(() => {
    // 先获取基本信息（不付费也能看）
    fetchAPI(`/api/result/${params.id}`)
      .then((data) => {
        setBasicResult(data)
        // 尝试获取完整结果
        return fetchAPI(`/api/result/${params.id}/full`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }).catch(() => null)
      })
      .then((fullData) => {
        if (fullData) {
          setResult(fullData)
          setIsUnlocked(true)
        }
        setLoading(false)
      })
      .catch(() => {
        setError("结果加载失败")
        setLoading(false)
      })
  }, [params.id])

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <Footer />
    </div>
  )

  if (error || !basicResult) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "结果不存在"}</p>
          <Link href="/test" className="text-blue-600 hover:underline">返回测试</Link>
        </div>
      </div>
      <Footer />
    </div>
  )

  const displayResult = result || basicResult
  const showLock = !isUnlocked && result === null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        {/* Result Header - Always visible */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 mb-2">你的 MBTI 性格类型是</p>
          <div className="inline-block px-8 py-4 rounded-2xl" style={{ backgroundColor: displayResult.color + "15" }}>
            <div className="text-6xl font-bold font-mono mb-2" style={{ color: displayResult.color }}>{displayResult.type}</div>
            <div className="text-xl font-heading font-semibold" style={{ color: displayResult.color }}>{displayResult.name_cn}</div>
            <div className="text-gray-500 text-sm">{displayResult.name_en}</div>
          </div>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">{displayResult.description}</p>
        </div>

        {/* Free: Radar Chart */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold">性格维度分析</h3>
            {showLock && (
              <button
                onClick={() => setShowPaywall(true)}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700"
              >
                解锁完整分析 ¥9.9
              </button>
            )}
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={[
                { subject: "外向性(E)", value: displayResult.radar_data[0], fullMark: 100 },
                { subject: "感觉性(S)", value: displayResult.radar_data[1], fullMark: 100 },
                { subject: "思考性(T)", value: displayResult.radar_data[2], fullMark: 100 },
                { subject: "判断性(J)", value: displayResult.radar_data[3], fullMark: 100 },
              ]}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <Radar name="Your Score" dataKey="value" stroke={displayResult.color} fill={displayResult.color} fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Free: Scores overview */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-heading font-semibold mb-4">维度得分</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(displayResult.scores).map(([dim, data]: [string, any]) => (
              <div key={dim} className="bg-gray-50 rounded-xl p-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{dim === "EI" ? "外向性" : dim === "SN" ? "感觉性" : dim === "TF" ? "思考性" : "判断性"}</span>
                  <span className="font-semibold" style={{ color: displayResult.color }}>{data.dominant}</span>
                </div>
                <div className="text-xs text-gray-400">
                  {data.dominant === "E" || data.dominant === "S" || data.dominant === "T" || data.dominant === "J" ? data[data.dominant === "E" || data.dominant === "S" || data.dominant === "T" ? data.dominant : "J"] : 0} / 15
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Paywall: Dimension Analysis (locked) */}
        {showLock ? (
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 z-10 pointer-events-none"></div>
            <h3 className="text-lg font-heading font-semibold mb-4">📖 深度维度解读</h3>
            <div className="space-y-3 opacity-50 blur-[1px]">
              {["EI", "SN", "TF", "JP"].map((dim) => (
                <div key={dim} className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm">{dim} 维度深度分析文字...</p>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowPaywall(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90"
              >
                🔓 解锁完整深度分析 ¥9.9
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-heading font-semibold mb-4">📖 深度维度解读</h3>
            <div className="space-y-4">
              {Object.entries(displayResult.dimension_analysis || {}).map(([dim, text]: [string, any]) => (
                <div key={dim} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold text-white" style={{ backgroundColor: displayResult.color }}>{dim}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {dim === "EI" ? "外向性" : dim === "SN" ? "感觉性" : dim === "TF" ? "思考性" : "判断性"}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paywall: Career & Compatibility (locked) */}
        {showLock ? (
          <div className="grid md:grid-cols-2 gap-6 mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent z-10 pointer-events-none"></div>
            <div className="bg-white rounded-2xl p-6 shadow-sm opacity-50 blur-[1px]">
              <h3 className="text-lg font-heading font-semibold mb-4">💼 职业建议</h3>
              <div className="flex flex-wrap gap-2">
                {["职业建议1", "职业建议2"].map((c) => (
                  <span key={c} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">{c}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm opacity-50 blur-[1px]">
              <h3 className="text-lg font-heading font-semibold mb-4">💕 性格匹配</h3>
              <p className="text-sm text-gray-500">解锁后可见</p>
            </div>
            <div className="col-span-2 text-center -mt-2 relative z-20">
              <button
                onClick={() => setShowPaywall(true)}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90"
              >
                解锁全部付费内容 ¥9.9
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-heading font-semibold mb-4">💼 职业建议</h3>
              <div className="flex flex-wrap gap-2">
                {displayResult.career_suggestions?.map((c: string) => (
                  <span key={c} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">{c}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-heading font-semibold mb-4">💕 性格匹配</h3>
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">最佳搭档</p>
                <div className="flex gap-2">
                  {displayResult.compatible_types?.map((t: string) => (
                    <span key={t} className="px-3 py-1 bg-green-50 text-green-600 text-sm rounded-full font-mono">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">需要磨合</p>
                <div className="flex gap-2">
                  {displayResult.incompatible_types?.map((t: string) => (
                    <span key={t} className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded-full font-mono">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share */}
        <div className="text-center">
          {isUnlocked ? (
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90">
              📤 分享我的结果
            </button>
          ) : (
            <button
              onClick={() => setShowPaywall(true)}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
            >
              登录后可永久查看所有测试记录
            </button>
          )}
        </div>
      </div>

      <Footer />

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal
          resultId={params.id as string}
          resultType={basicResult.type}
          onUnlocked={() => { setIsUnlocked(true); setShowPaywall(false) }}
          onClose={() => setShowPaywall(false)}
        />
      )}
    </div>
  )
}
