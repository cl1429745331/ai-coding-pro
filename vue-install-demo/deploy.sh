#!/bin/bash

# Vue项目Docker部署脚本
# 使用方法: ./deploy.sh [选项]
# 选项:
#   --build-only    只构建镜像，不启动容器
#   --restart       重启现有容器
#   --clean         清理旧镜像和容器

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目配置
PROJECT_NAME="vue-snake-game"
IMAGE_NAME="vue-snake-game:latest"
CONTAINER_NAME="vue-snake-game"
PORT="80"

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查Docker是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装，请先安装Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose未安装，请先安装Docker Compose"
        exit 1
    fi
}

# 清理旧容器和镜像
clean_old() {
    log_info "清理旧容器和镜像..."
    
    # 停止并删除容器
    if docker ps -a | grep -q $CONTAINER_NAME; then
        docker stop $CONTAINER_NAME || true
        docker rm $CONTAINER_NAME || true
        log_info "已删除旧容器"
    fi
    
    # 删除旧镜像
    if docker images | grep -q $PROJECT_NAME; then
        docker rmi $(docker images $PROJECT_NAME -q) || true
        log_info "已删除旧镜像"
    fi
    
    # 清理未使用的镜像
    docker image prune -f
}

# 构建镜像
build_image() {
    log_info "开始构建Docker镜像..."
    docker-compose build --no-cache
    log_info "镜像构建完成"
}

# 启动容器
start_container() {
    log_info "启动容器..."
    docker-compose up -d
    
    # 等待容器启动
    sleep 5
    
    # 检查容器状态
    if docker ps | grep -q $CONTAINER_NAME; then
        log_info "容器启动成功！"
        log_info "访问地址: http://localhost:$PORT"
    else
        log_error "容器启动失败"
        docker logs $CONTAINER_NAME
        exit 1
    fi
}

# 重启容器
restart_container() {
    log_info "重启容器..."
    docker-compose restart
    log_info "容器重启完成"
}

# 显示帮助信息
show_help() {
    echo "Vue项目Docker部署脚本"
    echo ""
    echo "使用方法:"
    echo "  ./deploy.sh [选项]"
    echo ""
    echo "选项:"
    echo "  --build-only    只构建镜像，不启动容器"
    echo "  --restart       重启现有容器"
    echo "  --clean         清理旧镜像和容器"
    echo "  --help          显示此帮助信息"
    echo ""
}

# 主函数
main() {
    check_docker
    
    case "${1:-}" in
        --build-only)
            clean_old
            build_image
            ;;
        --restart)
            restart_container
            ;;
        --clean)
            clean_old
            ;;
        --help)
            show_help
            ;;
        "")
            clean_old
            build_image
            start_container
            ;;
        *)
            log_error "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
