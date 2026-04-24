import json
import os
from typing import List, Dict, Any, Optional
from pathlib import Path

class DataService:
    """数据加载和处理服务"""
    
    def __init__(self, root_dir: str = None):
        if root_dir is None:
            root_dir = Path(__file__).parent.parent.parent
        self.root_dir = Path(root_dir)
        self._cache = {}
    
    def load_json_file(self, filename: str, use_cache: bool = True) -> Any:
        """加载 JSON 文件"""
        if use_cache and filename in self._cache:
            return self._cache[filename]
        
        file_path = self.root_dir / filename
        if not file_path.exists():
            raise FileNotFoundError(f"文件不存在：{file_path}")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        self._cache[filename] = data
        return data
    
    def get_disciples(self, category: Optional[str] = None, 
                     type_filter: Optional[str] = None,
                     search: Optional[str] = None) -> List[Dict]:
        """获取弟子记录"""
        data = self.load_json_file('disciples_records.json')
        
        results = data
        
        if category:
            results = [r for r in results if r.get('category') == category]
        
        if type_filter:
            results = [r for r in results if r.get('type') == type_filter]
        
        if search:
            search_lower = search.lower()
            results = [
                r for r in results 
                if search_lower in r.get('name', '').lower()
                or search_lower in r.get('styleName', '').lower()
                or search_lower in r.get('content', '').lower()
            ]
        
        return results
    
    def get_disciple_by_name(self, name: str) -> Optional[Dict]:
        """根据姓名获取弟子信息"""
        disciples = self.load_json_file('disciples_records.json')
        for disciple in disciples:
            if disciple.get('name') == name or disciple.get('styleName') == name:
                return disciple
        return None
    
    def get_chronicle_data(self) -> Any:
        """获取陆陇其年谱数据"""
        return self.load_json_file('lulonqgqilife/陆陇其年谱结构化数据.json')
    
    def get_network_data(self) -> Any:
        """获取师生关系网络数据"""
        return self.load_json_file('teacher_student_network.json')
    
    def get_sanyutang_data(self) -> Any:
        """获取三余堂数据"""
        return self.load_json_file('sanyutang_data.json')
    
    def get_statistics(self) -> Dict:
        """获取统计数据"""
        disciples = self.load_json_file('disciples_records.json')
        
        # 按类型统计
        type_counts = {}
        for disciple in disciples:
            disciple_type = disciple.get('type', '未知')
            type_counts[disciple_type] = type_counts.get(disciple_type, 0) + 1
        
        # 按来源统计
        source_counts = {}
        for disciple in disciples:
            origin = disciple.get('origin', '未知')
            source_counts[origin] = source_counts.get(origin, 0) + 1
        
        return {
            'total_disciples': len(disciples),
            'by_type': type_counts,
            'by_origin': source_counts
        }
    
    def clear_cache(self):
        """清除缓存"""
        self._cache = {}
