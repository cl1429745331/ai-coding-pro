# 故事影像馆数据库设计说明

## 📋 概述

本数据库设计为故事影像馆项目提供完整的数据存储和管理功能，支持照片展示、分类管理、用户互动等核心功能。

## 🗄️ 表结构详解

### 1. 照片表 (photos)
**主要功能**：存储所有照片的基本信息和技术参数

**核心字段**：
- `id` - 唯一标识符 (UUID)
- `title` - 照片标题
- `description` - 照片描述
- `story` - 照片背后的故事
- `category` - 分类标识
- `image_url` - 主图片地址
- `thumbnail_url` - 缩略图地址
- `is_published` - 是否发布

**摄影技术参数**：
- `camera_model` - 相机型号
- `lens` - 镜头信息
- `aperture` - 光圈值
- `shutter_speed` - 快门速度
- `iso` - ISO感光度
- `focal_length` - 焦距

**统计字段**：
- `view_count` - 浏览次数
- `like_count` - 点赞次数
- `comment_count` - 评论次数

### 2. 标签表 (tags)
**主要功能**：为照片提供灵活的标签分类系统

**核心字段**：
- `name` - 标签名称
- `slug` - URL友好的标签名
- `color` - 标签颜色
- `photo_count` - 关联照片数量（自动统计）

### 3. 分类表 (categories)
**主要功能**：定义照片的主要分类

**预设分类**：
- 风景摄影
- 人像摄影
- 街拍摄影
- 建筑摄影
- 生活摄影

### 4. 系列表 (series)
**主要功能**：组织相关照片，创建照片系列或相册

**核心字段**：
- `title` - 系列标题
- `description` - 系列描述
- `cover_photo_id` - 封面照片
- `photo_count` - 包含照片数量

### 5. 评论表 (comments)
**主要功能**：用户互动，允许访客对照片进行评论

**核心字段**：
- `photo_id` - 关联照片
- `author_name` - 评论者姓名
- `author_email` - 评论者邮箱
- `content` - 评论内容
- `is_approved` - 是否审核通过

### 6. 点赞表 (likes)
**主要功能**：记录用户对照片的点赞行为

**核心字段**：
- `photo_id` - 关联照片
- `ip_address` - 用户IP（防止重复点赞）

### 7. 关联表
- `photo_tags` - 照片与标签的多对多关系
- `photo_series` - 照片与系列的多对多关系

## 🔧 数据库部署

### 1. 在 Supabase 中执行

1. 登录 Supabase 控制台
2. 进入你的项目
3. 点击左侧菜单的 "SQL Editor"
4. 复制 `schema.sql` 文件内容
5. 粘贴到 SQL 编辑器中
6. 点击 "Run" 执行

### 2. 验证部署

执行以下查询验证表是否创建成功：

```sql
-- 查看所有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 查看照片表结构
\d photos;

-- 查看初始数据
SELECT * FROM categories;
SELECT * FROM tags;
```

## 📊 性能优化

### 1. 索引策略
- 主查询字段建立索引
- 外键关系建立索引
- 常用排序字段建立索引

### 2. 触发器自动化
- 自动更新时间戳
- 自动更新统计字段
- 自动维护关联计数

### 3. 行级安全 (RLS)
- 公开读取已发布内容
- 管理员权限控制
- 防止未授权访问

## 🔒 安全配置

### 1. 策略配置
```sql
-- 查看当前策略
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### 2. 权限管理
- 匿名用户：只能查看已发布内容
- 管理员：完全控制权限
- 评论审核：防止垃圾评论

## 🚀 使用示例

### 1. 查询已发布照片
```sql
SELECT p.*, c.name as category_name
FROM photos p
LEFT JOIN categories c ON p.category = c.slug
WHERE p.is_published = true
ORDER BY p.published_at DESC;
```

### 2. 获取带标签的照片
```sql
SELECT p.*, 
       array_agg(t.name) as tags,
       array_agg(t.color) as tag_colors
FROM photos p
JOIN photo_tags pt ON p.id = pt.photo_id
JOIN tags t ON pt.tag_id = t.id
WHERE p.is_published = true
GROUP BY p.id
ORDER BY p.created_at DESC;
```

### 3. 热门照片排行
```sql
SELECT * FROM popular_photos 
LIMIT 10;
```

### 4. 添加新照片
```sql
INSERT INTO photos (
    title, description, story, category,
    image_url, thumbnail_url, file_name,
    camera_model, lens, aperture, shutter_speed, iso,
    is_published
) VALUES (
    '城市夜景',
    '夜晚的城市充满了光与影的魅力',
    '这张照片拍摄于...',
    'landscape',
    'https://example.com/image.jpg',
    'https://example.com/thumb.jpg',
    'city_night_001.jpg',
    'Canon EOS R5',
    '24-70mm f/2.8',
    'f/8.0',
    '1/60s',
    1600,
    true
);
```

## 📈 数据统计

### 1. 照片统计
```sql
-- 总照片数
SELECT COUNT(*) FROM photos WHERE is_published = true;

-- 按分类统计
SELECT c.name, COUNT(p.id) as photo_count
FROM categories c
LEFT JOIN photos p ON c.slug = p.category AND p.is_published = true
GROUP BY c.id, c.name;
```

### 2. 互动统计
```sql
-- 总点赞数
SELECT SUM(like_count) FROM photos WHERE is_published = true;

-- 总评论数
SELECT COUNT(*) FROM comments WHERE is_approved = true;
```

## 🛠️ 维护建议

### 1. 定期清理
- 清理未发布的草稿照片
- 清理垃圾评论
- 优化数据库性能

### 2. 备份策略
- 定期备份数据库
- 备份重要图片文件
- 测试恢复流程

### 3. 监控指标
- 查询性能监控
- 存储空间使用
- 用户行为分析

## 🔄 未来扩展

### 1. 可能的新功能
- 用户账户系统
- 照片收藏功能
- 高级搜索功能
- 地理位置标记

### 2. 扩展表结构
- 用户表 (users)
- 收藏表 (favorites)
- 搜索历史表 (search_history)
- 位置信息表 (locations)

---

## 📞 技术支持

如果在使用过程中遇到问题，请参考：
1. Supabase 官方文档
2. PostgreSQL 文档
3. 项目技术方案设计文档 