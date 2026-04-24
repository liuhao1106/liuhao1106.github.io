@echo off
echo ========================================
echo   陆陇其寻踪 - 后端服务启动器
echo ========================================
echo.

REM 检查 Python 是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Python，请先安装 Python 3.8+
    pause
    exit /b 1
)

echo [信息] 正在检查依赖...
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo [信息] 正在安装依赖...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
)

echo.
echo [信息] 正在启动后端服务...
echo [信息] API 文档地址：http://localhost:8001/docs
echo [信息] 按 Ctrl+C 停止服务
echo.

cd /d "%~dp0"
python -m backend.main

pause
