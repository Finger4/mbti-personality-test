import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "MBTI 性格测试 | 发现你的真实性格",
  description: "专业的 MBTI 十六型人格测试，帮助你深入了解自己的性格特点、职业倾向和人际关系。",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
