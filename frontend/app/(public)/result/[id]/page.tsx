"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { fetchAPI } from "@/lib/utils"
import { useAuthStore } from "@/lib/store"
import type { TestResult } from "@/types"
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts"

export default function ResultPage() {
  const params = useParams()
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { token } = useAuthStore()

  useEffect(() => {
    fetchAPI(`/api/test/result/${params.id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(setResult)
      .catch(() => setError("结果加载失败"))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  if (error || !result) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 mb-4">{error || "结果不存在"}</p>
        <Link href="/test" className="text-blue-600 hover:underline">返回测试</Link>
      </div>
    </div>
  )

  const radarData = [
    { subject: "外向性(E)", value: result.radar_data[0], fullMark: 100 },
    { subject: "感觉性(S)", value: result.radar_data[1], fullMark: 100 },
    { subject: "思考性(T)", value: result.radar_data[2], fullMark: 100 },
    { subject: "判断性(J)", value: result.radar_data[3], fullMark: 100 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 mbti-gradient rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="font-heading font-bold">MBTI 测试</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/test" className="text-sm text-gray-600 hover:text-gray-900">重新测试</Link>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">首页</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Result Header */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 mb-2">你的 MBTI 性格类型是</p>
          <div className="inline-block px-8 py-4 rounded-2xl" style={{ backgroundColor: result.color + "15" }}>
            <div className="text-6xl font-bold font-mono mb-2" style={{ color: result.color }}>{result.type}</div>
            <div className="text-xl font-heading font-semibold" style={{ color: result.color }}>{result.name_cn}</div>
            <div className="text-gray-500 text-sm">{result.name_en}</div>
          </div>
          <p className="mt-6 text-gray-600 max-w-xl mx-auto leading-relaxed">{result.description}</p>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-heading font-semibold mb-4 text-center">性格维度分析</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <Radar name="Your Score" dataKey="value" stroke={result.color} fill={result.color} fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {Object.entries(result.scores).map(([dim, data]: [string, any]) => (
              <div key={dim} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">{dim === "EI" ? "外向性" : dim === "SN" ? "感觉性" : dim === "TF" ? "思考性" : "判断性"}</span>
                  <span className="text-xs text-gray-400">{dim}</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${(data[data.dominant === "E" || data.dominant === "S" || data.dominant === "T" || data.dominant === "J" ? data.dominant : "E"] / 15) * 100}%`, backgroundColor: result.color }}></div>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: result.color }}>{data.dominant}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{dim === "EI" ? "外向 " + data.E : "内向 " + data.I}</span>
                  <span>{dim === "SN" ? (data.S + " S") : dim === "TF" ? (data.T + " T") : dim === "JP" ? (data.J + " J") : ""}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dimension Analysis */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-heading font-semibold mb-4">各维度详细解读</h3>
          <div className="space-y-4">
            {Object.entries(result.dimension_analysis).map(([dim, text]: [string, any]) => (
              <div key={dim} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold text-white" style={{ backgroundColor: result.color }}>{dim}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {dim === "EI" ? "外向性" : dim === "SN" ? "感觉性" : dim === "TF" ? "思考性" : "判断性"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Career & Compatibility */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-heading font-semibold mb-4">💼 职业建议</h3>
            <div className="flex flex-wrap gap-2">
              {result.career_suggestions.map((c) => (
                <span key={c} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">{c}</span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-heading font-semibold mb-4">💕 性格匹配</h3>
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">最佳搭档</p>
              <div className="flex gap-2">
                {result.compatible_types.map((t) => (
                  <span key={t} className="px-3 py-1 bg-green-50 text-green-600 text-sm rounded-full font-mono">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">需要磨合</p>
              <div className="flex gap-2">
                {result.incompatible_types.map((t) => (
                  <span key={t} className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded-full font-mono">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Link href="/test" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            再次测试
          </Link>
          <Link href="/" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
