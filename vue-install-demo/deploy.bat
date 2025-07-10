@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM Vue项目Docker部署脚本 (Windows版本)
REM 使用方法: deploy.bat [选项]

set PROJECT_NAME=vue-snake-game
set IMAGE_NAME=vue-snake-game:latest
set CONTAINER_NAME=vue-snake-game
set PORT=80

REM 检查Docker是否安装
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker未安装，请先安装Docker Desktop
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose未安装，请先安装Docker Compose
    pause
    exit /b 1
)

REM 解析命令行参数
if "%1"=="--build-only" goto build_only
if "%1"=="--restart" goto restart
if "%1"=="--clean" goto clean
if "%1"=="--help" goto help
if "%1"=="" goto full_deploy

echo [ERROR] 未知选项: %1
goto help

:clean
echo [INFO] 清理旧容器和镜像...
docker stop %CONTAINER_NAME% 2>nul
docker rm %CONTAINER_NAME% 2>nul
for /f "tokens=*" %%i in ('docker images %PROJECT_NAME% -q 2^>nul') do docker rmi %%i 2>nul
docker image prune -f
echo [INFO] 清理完成
if "%1"=="--clean" goto end
goto build

:build
echo [INFO] 开始构建Docker镜像...
docker-compose build --no-cache
if errorlevel 1 (
    echo [ERROR] 镜像构建失败
    pause
    exit /b 1
)
echo [INFO] 镜像构建完成
goto end

:build_only
call :clean
call :build
goto end

:start
echo [INFO] 启动容器...
docker-compose up -d
if errorlevel 1 (
    echo [ERROR] 容器启动失败
    pause
    exit /b 1
)

REM 等待容器启动
timeout /t 5 /nobreak >nul

REM 检查容器状态
docker ps | findstr %CONTAINER_NAME% >nul
if errorlevel 1 (
    echo [ERROR] 容器启动失败
    docker logs %CONTAINER_NAME%
    pause
    exit /b 1
) else (
    echo [INFO] 容器启动成功！
    echo [INFO] 访问地址: http://localhost:%PORT%
)
goto end

:restart
echo [INFO] 重启容器...
docker-compose restart
echo [INFO] 容器重启完成
goto end

:full_deploy
call :clean
call :build
call :start
goto end

:help
echo Vue项目Docker部署脚本 (Windows版本)
echo.
echo 使用方法:
echo   deploy.bat [选项]
echo.
echo 选项:
echo   --build-only    只构建镜像，不启动容器
echo   --restart       重启现有容器
echo   --clean         清理旧镜像和容器
echo   --help          显示此帮助信息
echo.
goto end

:end
if "%1"=="" pause
