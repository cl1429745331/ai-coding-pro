# MCP 数据库服务器

这是一个 Model Context Protocol (MCP) 服务器，用于连接本地数据库并提供数据查询功能。

## 功能特性

- 🔌 **数据库连接**: 连接到本地 SQLite 数据库
- 📊 **资源暴露**: 将数据库表结构作为资源暴露给客户端
- 🔍 **只读查询**: 提供安全的只读 SQL 查询工具
- 🛡️ **安全性**: 自动阻止修改数据的 SQL 语句
- 📋 **表结构查看**: 查看详细的表结构和外键关系

## 安装依赖

```bash
pip install -r requirements.txt
```

## 运行服务器

### 直接运行
```bash
python database_server.py
```

### 在 Claude Desktop 中使用

1. 编辑 Claude Desktop 配置文件:
   - macOS/Linux: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. 添加服务器配置:
```json
{
  "mcpServers": {
    "database": {
      "command": "python",
      "args": ["/绝对路径/到/database_server.py"],
      "env": {
        "DATABASE_PATH": "example.db"
      }
    }
  }
}
```

3. 重启 Claude Desktop

## 可用功能

### 资源 (Resources)

- `database://tables` - 获取所有数据库表列表
- `database://schema/{table_name}` - 获取指定表的结构信息

### 工具 (Tools)

1. **list_tables()** - 列出数据库中的所有表
2. **describe_table(table_name)** - 获取指定表的详细结构信息
3. **execute_query(sql, limit)** - 执行只读 SQL 查询
4. **get_sample_queries()** - 获取示例查询语句

## 使用示例

### 查看所有表
```
请列出数据库中的所有表
```

### 查看表结构
```
请描述 employees 表的结构
```

### 执行查询
```
查询工程部的所有员工信息
```

```
按部门统计员工数量
```

## 安全特性

- ✅ 只允许 SELECT 查询
- ❌ 禁止 INSERT、UPDATE、DELETE、DROP 等修改操作
- 🔒 自动限制查询结果数量 (最大 1000 行)
- 🛡️ SQL 注入防护

## 数据库结构

服务器会自动创建示例数据库，包含以下表：

### employees (员工表)
- id: 员工ID (主键)
- name: 姓名
- department: 部门
- salary: 薪资
- hire_date: 入职日期

### departments (部门表)
- id: 部门ID (主键)
- name: 部门名称
- budget: 预算

## 扩展功能

要连接到其他类型的数据库，你可以：

1. 修改 `DatabaseManager` 类支持 MySQL、PostgreSQL 等
2. 安装相应的数据库驱动 (如 `pymysql`, `psycopg2`)
3. 更新连接字符串和查询语法

### MySQL 示例
```python
import pymysql

def connect(self):
    self.connection = pymysql.connect(
        host='localhost',
        user='username',
        password='password',
        database='dbname'
    )
```

### PostgreSQL 示例
```python
import psycopg2

def connect(self):
    self.connection = psycopg2.connect(
        host='localhost',
        database='dbname',
        user='username',
        password='password'
    )
```

## 故障排除

### 服务器无法启动
- 检查 Python 版本 (需要 3.8+)
- 确保已安装所有依赖
- 检查数据库文件权限

### Claude Desktop 未检测到服务器
- 确认配置文件路径正确
- 使用绝对路径而非相对路径
- 重启 Claude Desktop
- 检查 Claude 日志: `~/Library/Logs/Claude/mcp*.log`

### 查询失败
- 确认表名和列名拼写正确
- 检查 SQL 语法
- 确保查询为只读操作 (SELECT)
