# Vue项目Docker部署指南

本文档详细说明如何使用Docker部署Vue贪吃蛇游戏项目。

## 前置要求

### 系统要求
- Linux/macOS/Windows 10+
- 至少2GB可用内存
- 至少1GB可用磁盘空间

### 软件要求
- Docker 20.10+
- Docker Compose 2.0+

### Docker安装

#### Linux (Ubuntu/Debian)
```bash
# 更新包索引
sudo apt update

# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 将用户添加到docker组
sudo usermod -aG docker $USER
```

#### macOS
```bash
# 使用Homebrew安装
brew install docker docker-compose

# 或下载Docker Desktop for Mac
# https://www.docker.com/products/docker-desktop
```

#### Windows
下载并安装Docker Desktop for Windows:
https://www.docker.com/products/docker-desktop

## 项目结构

```
vue-install-demo/
├── src/                    # 源代码
├── public/                 # 静态资源
├── Dockerfile             # Docker镜像构建文件
├── docker-compose.yml     # Docker Compose配置
├── nginx.conf             # Nginx配置文件
├── .dockerignore          # Docker忽略文件
├── deploy.sh              # Linux/macOS部署脚本
├── deploy.bat             # Windows部署脚本
└── package.json           # 项目依赖
```

## 快速部署

### 方法一：使用部署脚本（推荐）

#### Linux/macOS
```bash
# 给脚本执行权限
chmod +x deploy.sh

# 完整部署（清理 + 构建 + 启动）
./deploy.sh

# 只构建镜像
./deploy.sh --build-only

# 重启容器
./deploy.sh --restart

# 清理旧容器和镜像
./deploy.sh --clean
```

#### Windows
```cmd
# 完整部署
deploy.bat

# 只构建镜像
deploy.bat --build-only

# 重启容器
deploy.bat --restart

# 清理旧容器和镜像
deploy.bat --clean
```

### 方法二：使用Docker Compose

```bash
# 构建并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart
```

### 方法三：使用Docker命令

```bash
# 构建镜像
docker build -t vue-snake-game .

# 运行容器
docker run -d --name vue-snake-game -p 80:80 vue-snake-game

# 查看容器状态
docker ps

# 查看日志
docker logs vue-snake-game

# 停止容器
docker stop vue-snake-game

# 删除容器
docker rm vue-snake-game
```

## 访问应用

部署成功后，在浏览器中访问：
- 本地访问：http://localhost
- 服务器访问：http://your-server-ip

## 常用操作

### 查看容器状态
```bash
docker ps
```

### 查看应用日志
```bash
docker logs vue-snake-game
```

### 进入容器
```bash
docker exec -it vue-snake-game sh
```

### 更新应用
```bash
# 停止并删除旧容器
docker-compose down

# 重新构建并启动
docker-compose up -d --build
```

## 生产环境配置

### 1. 使用自定义端口
修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "8080:80"  # 将应用映射到8080端口
```

### 2. 配置域名和SSL
建议使用反向代理（如Nginx）配置域名和SSL证书：

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. 资源限制
在 `docker-compose.yml` 中添加资源限制：
```yaml
deploy:
  resources:
    limits:
      memory: 512M
      cpus: '0.5'
```

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查看端口占用
   netstat -tulpn | grep :80
   
   # 修改docker-compose.yml中的端口映射
   ```

2. **构建失败**
   ```bash
   # 清理Docker缓存
   docker system prune -a
   
   # 重新构建
   docker-compose build --no-cache
   ```

3. **容器启动失败**
   ```bash
   # 查看详细日志
   docker logs vue-snake-game
   
   # 检查容器状态
   docker inspect vue-snake-game
   ```

### 性能优化

1. **启用Gzip压缩**（已在nginx.conf中配置）
2. **设置静态资源缓存**（已在nginx.conf中配置）
3. **使用CDN**加速静态资源加载

## 监控和维护

### 日志管理
```bash
# 查看实时日志
docker-compose logs -f

# 限制日志大小
docker-compose logs --tail=100
```

### 备份和恢复
```bash
# 导出镜像
docker save vue-snake-game > vue-snake-game.tar

# 导入镜像
docker load < vue-snake-game.tar
```

## 安全建议

1. 定期更新基础镜像
2. 使用非root用户运行容器
3. 配置防火墙规则
4. 启用SSL/TLS加密
5. 定期备份数据

## 支持

如有问题，请检查：
1. Docker和Docker Compose版本
2. 系统资源使用情况
3. 网络连接状态
4. 防火墙设置
