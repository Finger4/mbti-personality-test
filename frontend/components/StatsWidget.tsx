"use client"
import { useState, useEffect } from "react"
import { fetchAPI } from "@/lib/utils"

export default function StatsWidget() {
  const [stats, setStats] = useState({ home_views: 0, test_views: 0, total_views: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Track home page view
    fetchAPI("/api/track", { method: "POST", body: JSON.stringify({ page: "home" }) }).catch(() => {})
    // Fetch current stats
    fetchAPI("/api/stats").then((data) => {
      setStats(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">🌐</span>
            <span className="text-gray-600">首页浏览</span>
            <span className="font-semibold text-blue-600">{loading ? "--" : stats.home_views.toLocaleString()}</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">📝</span>
            <span className="text-gray-600">测试浏览</span>
            <span className="font-semibold text-purple-600">{loading ? "--" : stats.test_views.toLocaleString()}</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">📊</span>
            <span className="text-gray-600">总访问</span>
            <span className="font-semibold text-gray-700">{loading ? "--" : stats.total_views.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
