-- 故事影像馆数据库表结构
-- 创建时间：2024-12-22
-- 数据库：Supabase PostgreSQL

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 照片表 (photos)
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    story TEXT, -- 照片背后的故事
    category VARCHAR(100), -- 分类：风景、人像、街拍、建筑等
    
    -- 文件相关信息
    image_url TEXT NOT NULL, -- 主图片地址
    thumbnail_url TEXT, -- 缩略图地址
    file_name VARCHAR(500) NOT NULL,
    file_size INTEGER, -- 文件大小（字节）
    width INTEGER, -- 图片宽度
    height INTEGER, -- 图片高度
    
    -- 摄影技术参数 (EXIF信息)
    camera_model VARCHAR(100), -- 相机型号
    lens VARCHAR(100), -- 镜头
    aperture VARCHAR(20), -- 光圈值 (如 f/2.8)
    shutter_speed VARCHAR(20), -- 快门速度 (如 1/125s)
    iso INTEGER, -- ISO感光度
    focal_length INTEGER, -- 焦距(mm)
    
    -- 拍摄信息
    location VARCHAR(255), -- 拍摄地点
    taken_at TIMESTAMP WITH TIME ZONE, -- 拍摄时间
    
    -- 状态和统计
    is_published BOOLEAN DEFAULT FALSE, -- 是否发布
    view_count INTEGER DEFAULT 0, -- 浏览次数
    like_count INTEGER DEFAULT 0, -- 点赞次数
    comment_count INTEGER DEFAULT 0, -- 评论次数
    
    -- 排序和权重
    sort_order INTEGER DEFAULT 0, -- 排序权重
    featured BOOLEAN DEFAULT FALSE, -- 是否精选
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE -- 发布时间
);

-- 2. 标签表 (tags)
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL, -- URL友好的标签名
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- 标签颜色
    photo_count INTEGER DEFAULT 0, -- 关联照片数量
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 照片-标签关联表 (photo_tags)
CREATE TABLE photo_tags (
    photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (photo_id, tag_id)
);

-- 4. 系列表 (series)
CREATE TABLE series (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_photo_id UUID REFERENCES photos(id) ON DELETE SET NULL,
    photo_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 照片-系列关联表 (photo_series)
CREATE TABLE photo_series (
    photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
    series_id UUID REFERENCES series(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (photo_id, series_id)
);

-- 6. 评论表 (comments)
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE, -- 评论审核
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 点赞表 (likes)
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(photo_id, ip_address) -- 防止重复点赞
);

-- 8. 分类表 (categories)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    photo_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引优化查询性能
CREATE INDEX idx_photos_published ON photos(is_published);
CREATE INDEX idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX idx_photos_category ON photos(category);
CREATE INDEX idx_photos_featured ON photos(featured);
CREATE INDEX idx_photos_published_at ON photos(published_at DESC);
CREATE INDEX idx_comments_photo_id ON comments(photo_id);
CREATE INDEX idx_comments_approved ON comments(is_approved);
CREATE INDEX idx_likes_photo_id ON likes(photo_id);
CREATE INDEX idx_photo_tags_photo_id ON photo_tags(photo_id);
CREATE INDEX idx_photo_tags_tag_id ON photo_tags(tag_id);

-- 创建更新时间戳的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要自动更新时间戳的表创建触发器
CREATE TRIGGER update_photos_updated_at 
    BEFORE UPDATE ON photos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_series_updated_at 
    BEFORE UPDATE ON series 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建统计更新的触发器函数
CREATE OR REPLACE FUNCTION update_photo_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- 新增点赞/评论时更新统计
        IF TG_TABLE_NAME = 'likes' THEN
            UPDATE photos SET like_count = like_count + 1 WHERE id = NEW.photo_id;
        ELSIF TG_TABLE_NAME = 'comments' AND NEW.is_approved = TRUE THEN
            UPDATE photos SET comment_count = comment_count + 1 WHERE id = NEW.photo_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- 删除点赞/评论时更新统计
        IF TG_TABLE_NAME = 'likes' THEN
            UPDATE photos SET like_count = like_count - 1 WHERE id = OLD.photo_id;
        ELSIF TG_TABLE_NAME = 'comments' THEN
            UPDATE photos SET comment_count = comment_count - 1 WHERE id = OLD.photo_id;
        END IF;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- 评论审核状态变化时更新统计
        IF TG_TABLE_NAME = 'comments' THEN
            IF OLD.is_approved = FALSE AND NEW.is_approved = TRUE THEN
                UPDATE photos SET comment_count = comment_count + 1 WHERE id = NEW.photo_id;
            ELSIF OLD.is_approved = TRUE AND NEW.is_approved = FALSE THEN
                UPDATE photos SET comment_count = comment_count - 1 WHERE id = NEW.photo_id;
            END IF;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- 创建统计更新触发器
CREATE TRIGGER update_photo_like_count
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW EXECUTE FUNCTION update_photo_stats();

CREATE TRIGGER update_photo_comment_count
    AFTER INSERT OR UPDATE OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_photo_stats();

-- 创建标签统计更新触发器
CREATE OR REPLACE FUNCTION update_tag_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags SET photo_count = photo_count + 1 WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET photo_count = photo_count - 1 WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tag_photo_count
    AFTER INSERT OR DELETE ON photo_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_stats();

-- 启用行级安全 (RLS)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 创建安全策略
-- 所有人可以查看已发布的照片
CREATE POLICY "Anyone can view published photos" ON photos
    FOR SELECT USING (is_published = true);

-- 管理员可以管理所有照片（需要配置认证）
CREATE POLICY "Admin can manage photos" ON photos
    FOR ALL USING (auth.role() = 'admin');

-- 所有人可以查看已审核的评论
CREATE POLICY "Anyone can view approved comments" ON comments
    FOR SELECT USING (is_approved = true);

-- 所有人可以添加评论（但需要审核）
CREATE POLICY "Anyone can add comments" ON comments
    FOR INSERT WITH CHECK (true);

-- 所有人可以点赞
CREATE POLICY "Anyone can like photos" ON likes
    FOR INSERT WITH CHECK (true);

-- 所有人可以查看点赞
CREATE POLICY "Anyone can view likes" ON likes
    FOR SELECT USING (true);

-- 所有人可以查看标签
CREATE POLICY "Anyone can view tags" ON tags
    FOR SELECT USING (true);

-- 所有人可以查看已发布的系列
CREATE POLICY "Anyone can view published series" ON series
    FOR SELECT USING (is_published = true);

-- 所有人可以查看分类
CREATE POLICY "Anyone can view categories" ON categories
    FOR SELECT USING (true);

-- 插入一些初始数据
INSERT INTO categories (name, slug, description, sort_order) VALUES 
('风景摄影', 'landscape', '自然风光、山川河流、日出日落', 1),
('人像摄影', 'portrait', '人物肖像、情绪表达、光影塑造', 2),
('街拍摄影', 'street', '城市生活、街头文化、瞬间捕捉', 3),
('建筑摄影', 'architecture', '建筑美学、空间几何、城市印象', 4),
('生活摄影', 'lifestyle', '日常生活、情感记录、故事叙述', 5);

INSERT INTO tags (name, slug, description, color) VALUES 
('城市', 'city', '城市风光与建筑', '#3B82F6'),
('自然', 'nature', '自然风景与生物', '#10B981'),
('人文', 'human', '人文纪实与生活', '#F59E0B'),
('黑白', 'black-white', '黑白艺术摄影', '#6B7280'),
('夜景', 'night', '夜晚拍摄作品', '#8B5CF6'),
('长曝光', 'long-exposure', '长时间曝光技术', '#EF4444'),
('微距', 'macro', '微距摄影作品', '#14B8A6'),
('胶片', 'film', '胶片摄影作品', '#F97316');

-- 创建视图简化查询
CREATE VIEW photo_details AS
SELECT 
    p.*,
    c.name as category_name,
    array_agg(t.name) as tag_names,
    array_agg(t.color) as tag_colors
FROM photos p
LEFT JOIN categories c ON p.category = c.slug
LEFT JOIN photo_tags pt ON p.id = pt.photo_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.is_published = true
GROUP BY p.id, c.name
ORDER BY p.published_at DESC;

-- 创建热门照片视图
CREATE VIEW popular_photos AS
SELECT 
    p.*,
    (p.like_count * 3 + p.comment_count * 2 + p.view_count * 0.1) as popularity_score
FROM photos p
WHERE p.is_published = true
ORDER BY popularity_score DESC;

COMMENT ON TABLE photos IS '照片主表，存储所有照片的基本信息和技术参数';
COMMENT ON TABLE tags IS '标签表，用于照片分类和筛选';
COMMENT ON TABLE comments IS '评论表，存储用户对照片的评论';
COMMENT ON TABLE likes IS '点赞表，记录用户对照片的点赞行为';
COMMENT ON TABLE series IS '系列表，用于组织相关照片';
COMMENT ON TABLE categories IS '分类表，定义照片的主要分类'; 