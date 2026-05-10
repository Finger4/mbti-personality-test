# MBTI Personality Test | MBTI 性格测试

> 🌐 专业的 MBTI 十六型人格测试平台，基于 Next.js + FastAPI + PostgreSQL 构建

[English](./README.md) | 中文

## ✨ 功能特点

- 📋 **60 道科学题目** - 覆盖 MBTI 四大维度（外向/内向、感觉/直觉、思考/情感、判断/知觉）
- 📊 **深度性格分析** - 雷达图、维度详解、职业建议、人际匹配
- 🔐 **用户系统** - 注册登录、测试历史、个人主页
- 🛡️ **隐私保护** - 严格保护用户数据
- 📱 **响应式设计** - 完美支持移动端

## 🛠️ 技术栈

**前端**
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Recharts (雷达图)
- Zustand (状态管理)

**后端**
- FastAPI (Python)
- SQLAlchemy (ORM)
- PostgreSQL (数据库)
- Redis (缓存)
- JWT (认证)
- Pydantic (数据验证)

**部署**
- Docker Compose
- Nginx (反向代理)

## 🚀 快速开始

### 使用 Docker（推荐）

```bash
# 克隆仓库
git clone https://github.com/Abcdefg123456/mbti-personality-test.git
cd mbti-personality-test

# 启动所有服务
docker-compose up -d

# 访问
# 前端: http://localhost
# 后端 API: http://localhost:8000
# API 文档: http://localhost:8000/docs
```

### 本地开发

**后端**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**前端**
```bash
cd frontend
npm install
npm run dev
```

## 📁 项目结构

```
mbti-personality-test/
├── backend/
│   ├── app/
│   │   ├── api/          # API 路由
│   │   ├── core/         # 核心模块（安全、依赖）
│   │   ├── models/       # 数据库模型
│   │   ├── schemas/      # Pydantic 模型
│   │   ├── services/     # 业务逻辑
│   │   ├── config.py     # 配置
│   │   ├── database.py   # 数据库连接
│   │   └── main.py       # FastAPI 入口
│   ├── tests/
│   ├── migrations/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/              # Next.js App Router
│   │   ├── (public)/     # 公共页面（测试、结果、关于）
│   │   ├── (auth)/       # 认证页面（登录、注册）
│   │   ├── (user)/       # 用户页面（主页、历史）
│   │   └── (admin)/      # 管理页面
│   ├── components/       # React 组件
│   ├── lib/              # 工具函数
│   ├── types/            # TypeScript 类型
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── nginx.conf
├── .gitignore
└── README.md
```

## 🔑 环境变量

**后端 (.env)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/mbti_db
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-minimum-32-characters
```

**前端 (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📖 16 种人格类型

| 类型 | 名称 | 类型 | 名称 |
|------|------|------|------|
| INTJ | 建筑师 | ISTJ | 物流师 |
| INTP | 逻辑学家 | ISFJ | 守卫者 |
| ENTJ | 指挥官 | ESTJ | 总经理 |
| ENTP | 辩论家 | ESFJ | 执政官 |
| INFJ | 提倡者 | ISTP | 鉴赏家 |
| INFP | 调停者 | ISFP | 探险家 |
| ENFJ | 主人公 | ESTP | 企业家 |
| ENFP | 竞选者 | ESFP | 表演者 |

## 📄 License

MIT License
