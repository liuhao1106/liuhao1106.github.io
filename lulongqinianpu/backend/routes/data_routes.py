from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from ..services.data_service import DataService

router = APIRouter(prefix='/api', tags=['数据接口'])
data_service = DataService()

@router.get('/disciples')
async def get_disciples(
    category: Optional[str] = Query(None, description="类别筛选"),
    type_filter: Optional[str] = Query(None, description="类型筛选", alias="type"),
    search: Optional[str] = Query(None, description="搜索关键词")
):
    """
    获取弟子记录列表
    
    - **category**: 类别筛选 (如：chronicle)
    - **type**: 类型筛选 (如：生員/歲貢生)
    - **search**: 搜索关键词（姓名、字号、内容）
    """
    try:
        results = data_service.get_disciples(
            category=category,
            type_filter=type_filter,
            search=search
        )
        return {
            'success': True,
            'count': len(results),
            'data': results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/disciples/{name}')
async def get_disciple(name: str):
    """
    根据姓名获取弟子详细信息
    
    - **name**: 弟子姓名或字号
    """
    result = data_service.get_disciple_by_name(name)
    if result is None:
        raise HTTPException(status_code=404, detail=f"未找到弟子：{name}")
    
    return {
        'success': True,
        'data': result
    }

@router.get('/chronicle')
async def get_chronicle():
    """获取陆陇其年谱数据"""
    try:
        data = data_service.get_chronicle_data()
        return {
            'success': True,
            'data': data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/network')
async def get_network():
    """获取师生关系网络数据"""
    try:
        data = data_service.get_network_data()
        return {
            'success': True,
            'data': data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/sanyutang')
async def get_sanyutang():
    """获取三余堂数据"""
    try:
        data = data_service.get_sanyutang_data()
        return {
            'success': True,
            'data': data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/statistics')
async def get_statistics():
    """获取统计数据"""
    try:
        stats = data_service.get_statistics()
        return {
            'success': True,
            'data': stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/health')
async def health_check():
    """健康检查接口"""
    return {
        'status': 'healthy',
        'service': '陆陇其寻踪后端服务'
    }
