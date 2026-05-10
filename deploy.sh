#!/bin/bash
# =============================================================================
# MBTI 网站一键部署脚本
# 支持: Ubuntu 22.04 / 24.04
# 内存要求: 最低 1GB (已优化)
# =============================================================================

set -e

# -----------------------------------------------------------------------------
# 颜色输出
# -----------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log_info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step()  { echo -e "${CYAN}[STEP]${NC} $1"; }

# -----------------------------------------------------------------------------
# 全局变量
# -----------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="mbti-personality-test"
DOMAIN=""
ADMIN_EMAIL=""
DB_PASSWORD=""
REDIS_PASSWORD=""
SECRET_KEY=""
NGINX_SSL="no"
AUTO_SSL="no"

# 资源限制（1G友好）
BACKEND_MEM="350m"
FRONTEND_MEM="350m"
DB_MEM="256m"
REDIS_MEM="100m"
NGINX_MEM="50m"

# -----------------------------------------------------------------------------
# 交互式配置
# -----------------------------------------------------------------------------
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║         MBTI 网站一键部署脚本 v1.0                      ║${NC}"
echo -e "${CYAN}║         适配: Ubuntu 22.04 / 24.04  |  最低 1GB 内存   ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# 检查 root 权限
if [[ $EUID -ne 0 ]]; then
   log_warn "建议使用 root 权限运行: sudo bash $0"
   echo ""
fi

# -----------------------------------------------------------------------------
# Step 1: 检测系统环境
# -----------------------------------------------------------------------------
echo ""
log_step "Step 1/7: 检测系统环境..."
echo ""

# 检测 OS
if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    OS=$ID
    VER=$VERSION_ID
else
    log_error "无法检测操作系统"
    exit 1
fi

if [[ "$OS" != "ubuntu" ]]; then
    log_error "当前仅支持 Ubuntu，请使用 Ubuntu 22.04 或 24.04"
    exit 1
fi

log_ok "操作系统: Ubuntu $VER"

# 检测架构
ARCH=$(uname -m)
if [[ "$ARCH" != "x86_64" && "$ARCH" != "amd64" ]]; then
    log_warn "架构: $ARCH，推荐使用 x86_64"
fi
log_ok "CPU 架构: $ARCH"

# 检测内存
TOTAL_MEM=$(free -m | awk '/^Mem:/{print $2}')
log_ok "总内存: ${TOTAL_MEM} MB"

if [[ $TOTAL_MEM -lt 900 ]]; then
    log_warn "内存低于 1GB，部分功能可能不稳定"
fi

# 检测磁盘
DISK_AVAIL=$(df -BG / | awk 'NR==2 {print $4}' | sed 's/G//')
log_ok "可用磁盘: ${DISK_AVAIL} GB"

if [[ $DISK_AVAIL -lt 5 ]]; then
    log_error "磁盘空间不足，需要至少 5GB 可用空间"
    exit 1
fi

# 检测网络
if ! curl -s --connect-timeout 5 https://github.com > /dev/null 2>&1; then
    log_error "无法访问 GitHub，请检查网络"
    exit 1
fi
log_ok "网络连接正常"

# -----------------------------------------------------------------------------
# Step 2: 安装依赖
# -----------------------------------------------------------------------------
echo ""
log_step "Step 2/7: 安装系统依赖..."
echo ""

# 更新 apt 源
log_info "更新软件包列表..."
apt-get update -qq

# 安装基础工具
log_info "安装基础工具..."
apt-get install -y -qq \
    curl \
    wget \
    git \
    ufw \
    sudo \
    jq \
    bc \
    ca-certificates \
    gnupg \
    lsb-release \
    unzip \
    2>/dev/null

# 安装 Docker
if ! command -v docker &> /dev/null; then
    log_info "安装 Docker Engine..."
    
    # 添加 Docker GPG 密钥
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    
    # 添加 Docker 仓库
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
        tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # 安装 Docker
    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # 启动 Docker
    systemctl enable docker --now
    systemctl enable containerd --now
    
    log_ok "Docker 安装完成"
else
    log_ok "Docker 已安装: $(docker --version)"
fi

# 确保 docker-compose 可用（插件模式或独立）
if docker compose version &>/dev/null; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &>/dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    log_error "docker-compose 未找到"
    exit 1
fi
log_ok "Docker Compose: $(${DOCKER_COMPOSE} version)"

# -----------------------------------------------------------------------------
# Step 3: 配置项目
# -----------------------------------------------------------------------------
echo ""
log_step "Step 3/7: 配置项目参数..."
echo ""

# 生成随机密码
generate_password() {
    openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | head -c 16
}

# 询问域名
echo -e "${YELLOW}请输入你的域名（留空则使用 IP 访问）:${NC}"
echo -ne "  域名 (例: mbti.example.com): "
read -r DOMAIN_INPUT

if [[ -n "$DOMAIN_INPUT" ]]; then
    DOMAIN="$DOMAIN_INPUT"
    echo -e "${YELLOW}请输入管理员邮箱（用于 Let's Encrypt）:${NC}"
    echo -ne "  邮箱: "
    read -r ADMIN_EMAIL
    if [[ -z "$ADMIN_EMAIL" ]]; then
        ADMIN_EMAIL="admin@${DOMAIN}"
    fi
fi

# 生成密码
DB_PASSWORD="${DB_PASSWORD:-$(generate_password)}"
REDIS_PASSWORD="${REDIS_PASSWORD:-$(generate_password)}"
SECRET_KEY="${SECRET_KEY:-$(openssl rand -hex 32)}"

log_info "数据库密码已生成（已保存到 .env）"
log_info "Redis 密码已生成（已保存到 .env）"
log_info "Session 密钥已生成（已保存到 .env）"

# -----------------------------------------------------------------------------
# Step 4: 克隆/更新代码
# -----------------------------------------------------------------------------
echo ""
log_step "Step 4/7: 准备项目代码..."
echo ""

cd "$SCRIPT_DIR"

# 检查是否已存在
if [[ -d ".git" ]]; then
    log_info "检测到已有 Git 仓库，拉取最新代码..."
    git pull origin main
    log_ok "代码更新完成"
else
    log_info "克隆 MBTI 项目代码..."
    # 尝试使用 HTTPS + PAT 克隆私有仓库
    if [[ -n "$GITHUB_TOKEN" ]]; then
        git clone "https://${GITHUB_TOKEN}@github.com/Finger4/${PROJECT_NAME}.git" .
    elif [[ -n "$GITHUB_PAT" ]]; then
        git clone "https://${GITHUB_PAT}@github.com/Finger4/${PROJECT_NAME}.git" .
    else
        git clone "https://github.com/Finger4/${PROJECT_NAME}.git" .
    fi
    log_ok "代码克隆完成"
fi

# -----------------------------------------------------------------------------
# Step 5: 配置环境变量
# -----------------------------------------------------------------------------
echo ""
log_step "Step 5/7: 配置环境变量..."
echo ""

# 创建 .env 文件
cat > .env << EOF
# ============================================
# MBTI 网站环境配置 - 自动生成
# ============================================

# 数据库
DATABASE_URL=postgresql://mbti_user:${DB_PASSWORD}@db:5432/mbti_db
POSTGRES_USER=mbti_user
POSTGRES_PASSWORD=${DB_PASSWORD}
POSTGRES_DB=mbti_db

# Redis
REDIS_PASSWORD=${REDIS_PASSWORD}
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379/0

# 安全
SECRET_KEY=${SECRET_KEY}

# 前端
NEXT_PUBLIC_API_URL=${DOMAIN:+https://${DOMAIN}/api}
NEXT_PUBLIC_APP_URL=${DOMAIN:+https://${DOMAIN}}

# 邮件（可选，根据需要填写）
SMTP_HOST=smtp.163.com
SMTP_PORT=465
SMTP_USER=duyping525@163.com
SMTP_FROM=MBTI测试助手 <duyping525@163.com>
EOF

log_ok ".env 文件已创建"

# 创建 backend .env
cat > backend/.env << EOF
DATABASE_URL=postgresql://mbti_user:${DB_PASSWORD}@db:5432/mbti_db
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379/0
SECRET_KEY=${SECRET_KEY}
FRONTEND_URL=${DOMAIN:+https://${DOMAIN}}
EOF

# 创建 frontend .env.local
cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=${DOMAIN:+https://${DOMAIN}/api}
NEXT_PUBLIC_APP_URL=${DOMAIN:+https://${DOMAIN}}
EOF

log_ok "环境变量配置完成"

# -----------------------------------------------------------------------------
# Step 6: 配置 Docker Compose（1G 友好）
# -----------------------------------------------------------------------------
echo ""
log_step "Step 6/7: 配置 Docker 资源限制..."
echo ""

# 生成优化的 docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: mbti-backend
    ports:
      - "127.0.0.1:8000:8000"
    environment:
      - DATABASE_URL=postgresql://mbti_user:${DB_PASSWORD}@db:5432/mbti_db
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379/0
      - SECRET_KEY=${SECRET_KEY}
    depends_on:
      - db
      - redis
    restart: unless-stopped
    mem_limit: ${BACKEND_MEM}
    cpus: 1
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: mbti-frontend
    ports:
      - "127.0.0.1:3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=${DOMAIN:+https://${DOMAIN}/api}
    depends_on:
      - backend
    restart: unless-stopped
    mem_limit: ${FRONTEND_MEM}
    cpus: 0.5
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:16-alpine
    container_name: mbti-db
    environment:
      - POSTGRES_USER=mbti_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=mbti_db
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"
    restart: unless-stopped
    mem_limit: ${DB_MEM}
    command: >
      postgres
      -c shared_buffers=64MB
      -c max_connections=30
      -c effective_cache_size=128MB
      -c work_mem=4MB
      -c maintenance_work_mem=32MB
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U mbti_user -d mbti_db"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    container_name: mbti-redis
    command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory 80mb --maxmemory-policy allkeys-lru
    ports:
      - "127.0.0.1:6379:6379"
    volumes:
      - redisdata:/data
    restart: unless-stopped
    mem_limit: ${REDIS_MEM}
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: mbti-nginx
    ports:
      - "80:80"
      ${DOMAIN:+"- \"443:443\""}
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      ${DOMAIN:+"- ./ssl:/etc/nginx/ssl:ro"}
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
    mem_limit: ${NGINX_MEM}

volumes:
  pgdata:
  redisdata:
EOF

# 如果有域名，生成带 SSL 的 nginx 配置
if [[ -n "$DOMAIN" ]]; then
    cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # 上传大小限制
    client_max_body_size 10M;

    upstream frontend {
        server frontend:3000;
        keepalive 32;
    }

    upstream backend {
        server backend:8000;
        keepalive 32;
    }

    # HTTP -> HTTPS 重定向
    server {
        listen 80;
        server_name DOMAIN_PLACEHOLDER;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 301 https://$host$request_uri;
        }
    }

    # HTTPS 主站
    server {
        listen 443 ssl http2;
        server_name DOMAIN_PLACEHOLDER;
        
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 1d;
        
        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # 前端
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 86400;
        }

        # 后端 API
        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF
    # 替换占位符
    sed -i "s/DOMAIN_PLACEHOLDER/${DOMAIN}/g" nginx.conf
else
    # 无域名版本（纯 HTTP）
    cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    client_max_body_size 10M;

    upstream frontend {
        server frontend:3000;
        keepalive 32;
    }

    upstream backend {
        server backend:8000;
        keepalive 32;
    }

    server {
        listen 80;
        server_name _;

        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_cache_bypass $http_upgrade;
        }

        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
EOF
fi

log_ok "Docker Compose 配置完成"

# -----------------------------------------------------------------------------
# Step 7: 构建和启动
# -----------------------------------------------------------------------------
echo ""
log_step "Step 7/7: 构建和启动服务..."
echo ""

# 创建 ssl 目录（即使不用 SSL 也创建）
mkdir -p ssl

# 拉取最新代码
${DOCKER_COMPOSE} pull || true

# 构建并启动（无缓存构建确保最新）
log_info "正在构建 Docker 镜像（首次可能需要 5-10 分钟）..."
${DOCKER_COMPOSE} build --no-cache

log_info "正在启动所有服务..."
${DOCKER_COMPOSE} up -d

# 等待服务健康
log_info "等待服务启动..."
sleep 10

# 健康检查
log_info "执行健康检查..."
MAX_WAIT=60
WAITED=0
while true; do
    # 检查所有容器状态
    RUNNING=$(${DOCKER_COMPOSE} ps --format json 2>/dev/null | jq -r 'select(.Service!="nginx" and .State=="running") | .Service' 2>/dev/null | wc -l)
    
    if [[ $RUNNING -ge 3 ]] && [[ "$(${DOCKER_COMPOSE} ps db --format json 2>/dev/null | jq -r '.Health' 2>/dev/null)" == "healthy" || "$(${DOCKER_COMPOSE} ps db --format json 2>/dev/null | jq -r '.State' 2>/dev/null)" == "running" ]]; then
        log_ok "所有核心服务已启动"
        break
    fi
    
    sleep 5
    WAITED=$((WAITED + 5))
    
    if [[ $WAITED -ge $MAX_WAIT ]]; then
        log_warn "健康检查超时，显示当前状态："
        ${DOCKER_COMPOSE} ps
        break
    fi
done

# 初始化数据库（如果需要）
log_info "检查数据库初始化状态..."
sleep 5
${DOCKER_COMPOSE} exec -T backend python -c "
from app.database import engine, Base
from app.models import *
from app.seed_data import seed
import asyncio

async def init():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print('Tables created')

asyncio.run(init())
" 2>/dev/null && log_ok "数据库表已创建" || log_warn "数据库初始化（可能已存在）"

# 显示服务状态
echo ""
echo ""
log_ok "═══════════════════════════════════════════════════════════"
log_ok "               🎉 部署完成！                                 "
log_ok "═══════════════════════════════════════════════════════════"
echo ""

${DOCKER_COMPOSE} ps

echo ""
if [[ -n "$DOMAIN" ]]; then
    log_ok "访问地址: https://${DOMAIN}"
    log_ok "Let's Encrypt 证书申请已配置"
else
    SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_SERVER_IP")
    log_ok "访问地址: http://${SERVER_IP}"
fi
echo ""
log_ok "管理命令："
echo "  查看日志:  cd ${SCRIPT_DIR} && ${DOCKER_COMPOSE} logs -f"
echo "  重启服务:  cd ${SCRIPT_DIR} && ${DOCKER_COMPOSE} restart"
echo "  停止服务:  cd ${SCRIPT_DIR} && ${DOCKER_COMPOSE} down"
echo "  更新代码:  cd ${SCRIPT_DIR} && git pull && ${DOCKER_COMPOSE} up -d --build"
echo ""
log_info "数据库密码已保存到 .env 文件，请妥善保管"
echo ""

# SSL 证书申请提示（如果有域名）
if [[ -n "$DOMAIN" ]]; then
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}提示: 如果需要 HTTPS 证书，运行以下命令:${NC}"
    echo ""
    echo -e "  # 安装 certbot"
    echo -e "  sudo apt install certbot python3-certbot-nginx -y"
    echo ""
    echo -e "  # 申请证书（确保域名已解析到本机）"
    echo -e "  sudo certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos -m ${ADMIN_EMAIL}"
    echo ""
    echo -e "  # 自动续期测试"
    echo -e "  sudo certbot renew --dry-run"
    echo ""
fi
