"use client"
import { useState } from "react"
import { fetchAPI } from "@/lib/utils"

interface PaywallModalProps {
  resultId: string
  resultType: string
  onUnlocked: () => void
  onClose: () => void
}

export default function PaywallModal({ resultId, resultType, onUnlocked, onClose }: PaywallModalProps) {
  const [step, setStep] = useState<"intro"|"qrcode"|"paid">("intro")
  const [orderNo, setOrderNo] = useState("")
  const [loading, setLoading] = useState(false)
  const [polling, setPolling] = useState(false)

  const handleCreateOrder = async () => {
    setLoading(true)
    try {
      const data = await fetchAPI("/api/payment/create", {
        method: "POST",
        body: JSON.stringify({ result_id: resultId, amount: 990 }),
      })
      setOrderNo(data.order_no)
      setStep("qrcode")
      // 开始轮询支付状态
      startPolling(data.order_no)
    } catch (e) {
      alert("创建订单失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  const startPolling = (on: string) => {
    setPolling(true)
    const interval = setInterval(async () => {
      try {
        const res = await fetchAPI("/api/payment/status", {
          method: "POST",
          body: JSON.stringify({ order_no: on }),
        })
        if (res.status === "paid") {
          clearInterval(interval)
          setStep("paid")
          setPolling(false)
          setTimeout(() => {
            onUnlocked()
            onClose()
          }, 1500)
        }
      } catch (e) {}
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden">
        {step === "intro" && (
          <>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                🔒
              </div>
              <h2 className="text-xl font-heading font-bold mb-2">解锁完整分析报告</h2>
              <p className="text-gray-500 mb-6">你的 MBTI 类型是 <strong className="text-blue-600">{resultType}</strong></p>
              <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
                <p className="text-sm text-gray-600 mb-2 font-medium">付费后可获得：</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">✅ <span>完整四维度深度解读</span></li>
                  <li className="flex items-center gap-2">✅ <span>雷达图可视化分析</span></li>
                  <li className="flex items-center gap-2">✅ <span>职业发展建议</span></li>
                  <li className="flex items-center gap-2">✅ <span>人际匹配分析</span></li>
                  <li className="flex items-center gap-2">✅ <span>可分享结果卡片</span></li>
                </ul>
              </div>
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-blue-600">¥9.9</span>
                <span className="text-gray-400 line-through text-lg ml-2">¥49</span>
              </div>
            </div>
            <div className="px-8 pb-8 flex flex-col gap-3">
              <button
                onClick={handleCreateOrder}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {loading ? "正在跳转..." : "微信/支付宝 立即解锁"}
              </button>
              <button onClick={onClose} className="w-full py-2 text-gray-400 text-sm hover:text-gray-600">
                稍后再说
              </button>
            </div>
          </>
        )}

        {step === "qrcode" && (
          <>
            <div className="p-8 text-center">
              <h2 className="text-xl font-heading font-bold mb-2">扫码支付</h2>
              <p className="text-gray-500 text-sm mb-6">请使用微信或支付宝扫码支付 <strong className="text-blue-600">¥9.9</strong></p>
              <div className="bg-gray-50 rounded-xl p-4 mb-4 inline-block">
                {/* 二维码占位 - 实际从API获取 */}
                <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-5xl mb-2">💳</div>
                    <p className="text-xs">支付二维码</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-2">订单号：{orderNo}</p>
              {polling && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  等待支付中...
                </div>
              )}
            </div>
            <div className="px-8 pb-8">
              <button onClick={onClose} className="w-full py-2 text-gray-400 text-sm hover:text-gray-600">
                取消支付
              </button>
            </div>
          </>
        )}

        {step === "paid" && (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-xl font-heading font-bold mb-2">支付成功！</h2>
            <p className="text-gray-500">正在加载完整分析...</p>
          </div>
        )}
      </div>
    </div>
  )
}
