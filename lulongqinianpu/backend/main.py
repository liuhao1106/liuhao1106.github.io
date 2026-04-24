from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
import uvicorn

from backend.routes import data_routes

# 创建 FastAPI 应用
app = FastAPI(
    title="陆陇其寻踪 API",
    description="陆陇其文献资料后端服务",
    version="1.0.0"
)

# 配置 CORS - 允许前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应该限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(data_routes.router)

# 获取项目根目录
ROOT_DIR = Path(__file__).parent.parent

# 挂载静态文件目录
@app.get("/")
async def serve_frontend():
    """提供前端页面"""
    index_path = ROOT_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"message": "欢迎访问陆陇其寻踪 API", "docs": "/docs"}

# 启动服务器
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True
    )
