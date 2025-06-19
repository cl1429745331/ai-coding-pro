import asyncio
import sqlite3
import json
from typing import List, Dict, Any
from contextlib import asynccontextmanager
from pathlib import Path

from mcp.server.fastmcp import FastMCP


class DatabaseManager:
    """数据库管理器，处理数据库连接和查询"""
    
    def __init__(self, db_path: str = "example.db"):
        self.db_path = db_path
        self.connection = None
        
    def connect(self):
        """连接到数据库"""
        self.connection = sqlite3.connect(self.db_path)
        self.connection.row_factory = sqlite3.Row  # 使结果可以通过列名访问
        
    def disconnect(self):
        """断开数据库连接"""
        if self.connection:
            self.connection.close()
            
    def get_tables(self) -> List[str]:
        """获取所有表名"""
        if not self.connection:
            raise RuntimeError("数据库未连接")
            
        cursor = self.connection.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        )
        return [row[0] for row in cursor.fetchall()]
    
    def get_table_schema(self, table_name: str) -> Dict[str, Any]:
        """获取表结构信息"""
        if not self.connection:
            raise RuntimeError("数据库未连接")
            
        # 获取表的列信息
        cursor = self.connection.execute(f"PRAGMA table_info({table_name})")
        columns = []
        for row in cursor.fetchall():
            columns.append({
                "name": row[1],
                "type": row[2],
                "not_null": bool(row[3]),
                "default_value": row[4],
                "primary_key": bool(row[5])
            })
            
        # 获取表的外键信息
        cursor = self.connection.execute(f"PRAGMA foreign_key_list({table_name})")
        foreign_keys = []
        for row in cursor.fetchall():
            foreign_keys.append({
                "column": row[3],
                "references_table": row[2],
                "references_column": row[4]
            })
            
        return {
            "table_name": table_name,
            "columns": columns,
            "foreign_keys": foreign_keys
        }
    
    def execute_readonly_query(self, query: str) -> List[Dict[str, Any]]:
        """执行只读查询"""
        if not self.connection:
            raise RuntimeError("数据库未连接")
            
        # 检查查询是否为只读
        query_lower = query.lower().strip()
        forbidden_keywords = ['insert', 'update', 'delete', 'drop', 'create', 'alter', 'truncate']
        
        if any(keyword in query_lower for keyword in forbidden_keywords):
            raise ValueError("只允许执行只读查询 (SELECT 语句)")
            
        cursor = self.connection.execute(query)
        columns = [description[0] for description in cursor.description]
        results = []
        
        for row in cursor.fetchall():
            results.append(dict(zip(columns, row)))
            
        return results


# 全局数据库管理器
db_manager = DatabaseManager()


def init_sample_database():
    """初始化示例数据库"""
    if not Path("example.db").exists():
        conn = sqlite3.connect("example.db")
        
        # 创建示例表
        conn.execute("""
            CREATE TABLE employees (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                department TEXT,
                salary REAL,
                hire_date DATE
            )
        """)
        
        conn.execute("""
            CREATE TABLE departments (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                budget REAL
            )
        """)
        
        # 插入示例数据
        conn.execute("INSERT INTO departments VALUES (1, '工程部', 500000)")
        conn.execute("INSERT INTO departments VALUES (2, '销售部', 300000)")
        conn.execute("INSERT INTO departments VALUES (3, '人事部', 200000)")
        
        conn.execute("INSERT INTO employees VALUES (1, '张三', '工程部', 80000, '2023-01-15')")
        conn.execute("INSERT INTO employees VALUES (2, '李四', '销售部', 60000, '2023-02-20')")
        conn.execute("INSERT INTO employees VALUES (3, '王五', '人事部', 55000, '2023-03-10')")
        conn.execute("INSERT INTO employees VALUES (4, '赵六', '工程部', 75000, '2023-04-05')")
        
        conn.commit()
        conn.close()
        print("示例数据库已创建")


@asynccontextmanager
async def lifespan_handler(server):
    """服务器生命周期管理"""
    # 启动时初始化
    init_sample_database()
    db_manager.connect()
    print("数据库连接已建立")
    
    try:
        yield {}
    finally:
        # 关闭时清理
        db_manager.disconnect()
        print("数据库连接已关闭")


# 创建服务器实例
mcp = FastMCP("Database Server", lifespan=lifespan_handler)


@mcp.resource("database://tables")
def get_all_tables() -> str:
    """获取所有数据库表列表"""
    try:
        tables = db_manager.get_tables()
        return json.dumps({
            "tables": tables,
            "count": len(tables),
            "description": "数据库中所有可用的表"
        }, ensure_ascii=False, indent=2)
    except Exception as e:
        return f"获取表列表失败: {str(e)}"


@mcp.resource("database://schema/{table_name}")
def get_table_schema_resource(table_name: str) -> str:
    """获取指定表的结构信息"""
    try:
        schema = db_manager.get_table_schema(table_name)
        return json.dumps(schema, ensure_ascii=False, indent=2)
    except Exception as e:
        return f"获取表 '{table_name}' 结构失败: {str(e)}"


@mcp.tool()
def list_tables() -> str:
    """列出数据库中的所有表"""
    try:
        tables = db_manager.get_tables()
        if not tables:
            return "数据库中没有找到任何表"
        
        result = "数据库表列表:\n"
        for i, table in enumerate(tables, 1):
            result += f"{i}. {table}\n"
        
        return result
    except Exception as e:
        return f"获取表列表失败: {str(e)}"


@mcp.tool()
def describe_table(table_name: str) -> str:
    """获取指定表的详细结构信息"""
    try:
        schema = db_manager.get_table_schema(table_name)
        
        result = f"表 '{table_name}' 的结构:\n\n"
        result += "列信息:\n"
        result += "-" * 50 + "\n"
        
        for col in schema["columns"]:
            result += f"列名: {col['name']}\n"
            result += f"  类型: {col['type']}\n"
            result += f"  允许NULL: {'否' if col['not_null'] else '是'}\n"
            result += f"  默认值: {col['default_value'] or '无'}\n"
            result += f"  主键: {'是' if col['primary_key'] else '否'}\n"
            result += "\n"
        
        if schema["foreign_keys"]:
            result += "外键约束:\n"
            result += "-" * 50 + "\n"
            for fk in schema["foreign_keys"]:
                result += f"{fk['column']} -> {fk['references_table']}.{fk['references_column']}\n"
        
        return result
    except Exception as e:
        return f"获取表结构失败: {str(e)}"


@mcp.tool()
def execute_query(sql: str, limit: int = 100) -> str:
    """执行只读 SQL 查询"""
    try:
        # 限制返回行数
        if limit > 1000:
            limit = 1000
            
        # 在查询末尾添加 LIMIT 子句（如果没有的话）
        sql_lower = sql.lower().strip()
        if not sql_lower.endswith(';'):
            sql += ';'
        if 'limit' not in sql_lower:
            sql = sql.rstrip(';') + f' LIMIT {limit};'
        
        results = db_manager.execute_readonly_query(sql)
        
        if not results:
            return "查询成功，但没有返回任何结果"
        
        # 格式化结果
        result_text = f"查询结果 (显示 {len(results)} 行):\n"
        result_text += "=" * 50 + "\n"
        
        # 获取列名
        if results:
            columns = list(results[0].keys())
            
            # 表头
            header = " | ".join(f"{col:15}" for col in columns)
            result_text += header + "\n"
            result_text += "-" * len(header) + "\n"
            
            # 数据行
            for row in results:
                row_text = " | ".join(f"{str(row[col]):15}" for col in columns)
                result_text += row_text + "\n"
        
        return result_text
        
    except ValueError as e:
        return f"查询被拒绝: {str(e)}"
    except Exception as e:
        return f"查询执行失败: {str(e)}"


@mcp.tool()
def get_sample_queries() -> str:
    """获取一些示例查询语句"""
    samples = [
        "-- 查看所有员工信息",
        "SELECT * FROM employees;",
        "",
        "-- 按部门统计员工数量",
        "SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department;",
        "",
        "-- 查看工程部员工及其薪资",
        "SELECT name, salary FROM employees WHERE department = '工程部' ORDER BY salary DESC;",
        "",
        "-- 查看平均薪资最高的部门",
        "SELECT department, AVG(salary) as avg_salary FROM employees GROUP BY department ORDER BY avg_salary DESC;",
        "",
        "-- 查看所有部门信息",
        "SELECT * FROM departments;"
    ]
    
    return "\n".join(samples)


if __name__ == "__main__":
    mcp.run() 