-- 故事影像馆测试数据导入
-- 可以直接在Supabase SQL编辑器中执行此文件

-- 1. 清理现有数据（可选，如果需要重新开始）
-- DELETE FROM photo_tags;
-- DELETE FROM likes;
-- DELETE FROM comments;
-- DELETE FROM photos;
-- DELETE FROM tags;
-- DELETE FROM categories;

-- 2. 插入分类数据
INSERT INTO categories (name, slug, description, photo_count, sort_order) VALUES
('风景摄影', 'landscape', '自然风光、山川河流、日出日落等风景类摄影作品', 0, 1),
('人像摄影', 'portrait', '人物肖像、情绪表达、生活瞬间等人像类摄影作品', 0, 2),
('街头摄影', 'street', '街头巷尾、都市生活、人文纪实等街拍类摄影作品', 0, 3),
('建筑摄影', 'architecture', '建筑结构、空间美学、城市天际线等建筑类摄影作品', 0, 4),
('生活摄影', 'life', '日常生活、静物、美食等生活类摄影作品', 0, 5)
ON CONFLICT (name) DO NOTHING;

-- 3. 插入标签数据
INSERT INTO tags (name, slug, description, color, photo_count) VALUES
('黄金时刻', 'golden-hour', '黄金时刻拍摄的照片，光线柔和温暖', '#F59E0B', 0),
('长曝光', 'long-exposure', '使用长曝光技术拍摄的照片', '#8B5CF6', 0),
('街拍', 'street-photography', '街头抓拍的真实生活瞬间', '#EF4444', 0),
('黑白', 'black-white', '黑白色调的艺术摄影作品', '#6B7280', 0),
('夜景', 'night-scene', '夜间拍摄的城市或自然景观', '#1E40AF', 0),
('人文', 'humanity', '体现人文关怀和社会生活的摄影作品', '#059669', 0),
('极简', 'minimalism', '极简主义风格的摄影作品', '#DC2626', 0),
('自然', 'nature', '自然环境中的生物和景观', '#16A34A', 0),
('城市', 'urban', '城市建筑和都市生活场景', '#7C3AED', 0),
('情绪', 'emotion', '表达情感和内心世界的摄影作品', '#DB2777', 0)
ON CONFLICT (name) DO NOTHING;

-- 4. 插入照片数据
INSERT INTO photos (
  title, description, story, category,
  image_url, thumbnail_url, file_name, file_size, width, height,
  camera_model, lens, aperture, shutter_speed, iso, focal_length,
  location, taken_at,
  is_published, view_count, like_count, comment_count, sort_order, featured,
  published_at
) VALUES
(
  '晨雾中的桂林山水',
  '桂林漓江边上的经典山水景观，晨雾缭绕，如诗如画。拍摄于清晨6点左右，当时的光线非常柔和，山峰在薄雾中若隐若现，呈现出中国画般的意境。',
  '那是一个春天的早晨，我凌晨4点就起床，骑着自行车来到漓江边寻找最佳拍摄点。等待了近两个小时，当第一缕阳光透过云层洒在水面上时，整个世界都安静了下来。远山如黛，近水如镜，那一刻我知道这就是我要的画面。这张照片让我深深爱上了风景摄影，也让我明白了耐心等待的重要性。',
  '风景摄影',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80',
  'guilin-mountains-morning-mist.jpg',
  2456789, 1200, 800,
  'Sony A7R IV', 'Sony FE 24-70mm f/2.8 GM', 'f/8.0', '1/60s', 100, 35,
  '广西桂林市漓江风景区', '2024-03-15 06:23:00+08:00',
  true, 234, 45, 8, 1, true,
  '2024-03-15 09:30:00+08:00'
),
(
  '老街巷的午后光影',
  '成都宽窄巷子里的一个午后，阳光透过古老的屋檐洒在青石板路上，形成美丽的光影对比。一位老人正在悠闲地喝茶，诠释了慢生活的美好。',
  '在成都的那个午后，我漫步在宽窄巷子里，被这里的悠闲氛围深深吸引。看到这位老人独自坐在茶馆门口，阳光恰好从屋檐间洒下，在他身上投下斑驳的影子。我静静地等了十分钟，直到他端起茶杯的那一刻，快门声轻轻响起。这张照片让我感受到了时间的静好，也让我明白了街头摄影的真谛——等待那个决定性的瞬间。',
  '街头摄影',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=80',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80',
  'chengdu-old-street-afternoon.jpg',
  1876543, 1200, 800,
  'Fujifilm X-T4', 'Fujifilm XF 56mm f/1.2 R', 'f/2.8', '1/125s', 200, 56,
  '四川成都市锦江区宽窄巷子', '2024-04-20 14:30:00+08:00',
  true, 189, 32, 12, 2, true,
  '2024-04-20 18:00:00+08:00'
),
(
  '城市夜景的璀璨灯火',
  '上海外滩的夜景，黄浦江两岸的建筑灯火辉煌，倒影在江面上形成美丽的画面。使用长曝光技术，让车流变成了光的河流，整个画面充满了现代都市的活力。',
  '这是我第一次尝试城市夜景长曝光摄影。那晚我在外滩等到了晚上9点，架好三脚架，调整好参数，开始了为期2小时的拍摄。看着取景器里车流变成光带，建筑灯光在江面上跳舞，我被这座城市的活力深深震撼了。这张照片不仅记录了上海的美丽夜景，也记录了我对摄影技术的一次突破。',
  '建筑摄影',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=80',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80',
  'shanghai-bund-night-skyline.jpg',
  3245678, 1200, 800,
  'Canon EOS R5', 'Canon RF 24-105mm f/4 L IS USM', 'f/11.0', '30s', 100, 24,
  '上海市黄浦区外滩', '2024-05-10 21:15:00+08:00',
  true, 456, 78, 15, 3, true,
  '2024-05-10 23:30:00+08:00'
),
(
  '藏族老人的深邃眼神',
  '在拉萨八角街拍摄的一位藏族老人，他的眼神中透露出岁月的沧桑和内心的宁静。黑白处理增强了画面的情感表达，让人能够感受到西藏文化的深厚底蕴。',
  '在拉萨的那几天，我每天都会到八角街转转。这位老人总是坐在同一个地方，手里转着转经筒，嘴里念着经文。第三天的下午，当我经过时，他抬头看了我一眼，那一刻我被他眼中的宁静所打动。征得他的同意后，我为他拍下了这张照片。回到酒店后，我将照片转为黑白，因为我觉得只有这样才能更好地表达他内心的纯净。',
  '人像摄影',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=80',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80',
  'tibetan-elder-portrait-bw.jpg',
  1654321, 1200, 800,
  'Nikon D850', 'Nikon AF-S 85mm f/1.8G', 'f/2.8', '1/200s', 400, 85,
  '西藏拉萨市城关区八角街', '2024-06-08 15:45:00+08:00',
  true, 345, 67, 23, 4, true,
  '2024-06-08 19:00:00+08:00'
),
(
  '现代建筑的几何美学',
  '北京望京SOHO的建筑外观，独特的流线型设计在蓝天白云的映衬下显得格外醒目。通过仰视角度和对称构图，突出了现代建筑的几何美感和设计感。',
  '那天路过望京SOHO，被这栋建筑的独特造型深深吸引。我围着建筑走了一圈，寻找最佳的拍摄角度。最终选择了这个仰视的角度，因为它能够最好地展现建筑的流线型设计。等待了20分钟，直到有一朵白云飘过，为画面增添了层次感。现代建筑摄影不仅仅是记录建筑本身，更是要捕捉建筑与环境、光影的完美结合。',
  '建筑摄影',
  'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=80',
  'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80',
  'beijing-soho-architecture.jpg',
  2876543, 1200, 800,
  'Canon EOS R6', 'Canon RF 16-35mm f/2.8 L IS USM', 'f/8.0', '1/250s', 200, 16,
  '北京市朝阳区望京街道', '2024-07-12 11:20:00+08:00',
  true, 278, 54, 9, 5, false,
  '2024-07-12 16:45:00+08:00'
),
(
  '海边日落的金色时光',
  '在海南三亚的海边拍摄的日落景象，金色的阳光洒在波光粼粼的海面上，远处的渔船剪影为画面增添了生活气息。这是黄金时刻摄影的完美体现。',
  '在三亚的最后一个傍晚，我来到海边等待日落。当太阳慢慢接近海平面时，整个天空都被染成了金黄色。海面上波光粼粼，远处有几艘渔船正在归航。我快速调整相机参数，捕捉到了这个完美的瞬间。这张照片让我想起了海明威的《老人与海》，也让我感受到了大自然的壮美和人类的渺小。',
  '风景摄影',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80',
  'sanya-sunset-golden-hour.jpg',
  2145678, 1200, 800,
  'Nikon D850', 'Nikon AF-S 70-200mm f/2.8E FL ED VR', 'f/5.6', '1/500s', 200, 135,
  '海南省三亚市天涯海角', '2024-08-25 18:30:00+08:00',
  true, 512, 89, 19, 6, true,
  '2024-08-25 20:00:00+08:00'
),
(
  '雨后街道的宁静时刻',
  '杭州西湖边的一条小巷，雨后的石板路反射着路灯的光芒，几把彩色的雨伞为黑白的画面增添了一抹亮色。这是一个关于等待和希望的故事。',
  '那天下午杭州下了一场大雨，我原本计划去西湖拍摄，但大雨让我改变了计划。雨停后，我在西湖边的小巷里漫步，被雨后的宁静氛围所吸引。看到这几把遗落在路边的雨伞，我突然想到了"雨后彩虹"的寓意。虽然天空中没有彩虹，但这些彩色的雨伞就像是生活中的希望，在灰暗的环境中依然闪闪发光。',
  '街头摄影',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=80',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80',
  'hangzhou-street-after-rain.jpg',
  1987654, 1200, 800,
  'Sony A7 III', 'Sony FE 35mm f/1.8', 'f/2.8', '1/80s', 800, 35,
  '浙江省杭州市西湖区', '2024-09-03 16:20:00+08:00',
  true, 167, 28, 7, 7, false,
  '2024-09-03 18:30:00+08:00'
),
(
  '咖啡馆里的温暖时光',
  '上海法租界的一家咖啡馆，午后的阳光透过落地窗洒在桌面上，一杯拿铁咖啡冒着热气，旁边放着一本书。这是都市生活中的小确幸。',
  '那是一个普通的周末午后，我在上海法租界的小巷里闲逛，被这家咖啡馆的温馨氛围所吸引。我点了一杯拿铁，选择了靠窗的位置坐下。阳光透过玻璃窗洒在桌面上，形成了美丽的光影。我拿出相机，捕捉下了这个宁静的瞬间。这张照片不仅记录了一个美好的午后，也让我思考了在快节奏的都市生活中，我们需要偶尔放慢脚步，享受这些简单的美好。',
  '生活摄影',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=80',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80',
  'shanghai-cafe-afternoon.jpg',
  1456789, 1200, 800,
  'Fujifilm X-T4', 'Fujifilm XF 23mm f/1.4 R', 'f/2.0', '1/60s', 400, 23,
  '上海市黄浦区淮海中路', '2024-10-15 14:45:00+08:00',
  true, 134, 21, 5, 8, false,
  '2024-10-15 17:00:00+08:00'
);

-- 5. 插入照片-标签关联数据
INSERT INTO photo_tags (photo_id, tag_id) VALUES
-- 晨雾中的桂林山水
((SELECT id FROM photos WHERE title = '晨雾中的桂林山水'), (SELECT id FROM tags WHERE name = '黄金时刻')),
((SELECT id FROM photos WHERE title = '晨雾中的桂林山水'), (SELECT id FROM tags WHERE name = '自然')),
-- 老街巷的午后光影
((SELECT id FROM photos WHERE title = '老街巷的午后光影'), (SELECT id FROM tags WHERE name = '街拍')),
((SELECT id FROM photos WHERE title = '老街巷的午后光影'), (SELECT id FROM tags WHERE name = '人文')),
-- 城市夜景的璀璨灯火
((SELECT id FROM photos WHERE title = '城市夜景的璀璨灯火'), (SELECT id FROM tags WHERE name = '夜景')),
((SELECT id FROM photos WHERE title = '城市夜景的璀璨灯火'), (SELECT id FROM tags WHERE name = '长曝光')),
((SELECT id FROM photos WHERE title = '城市夜景的璀璨灯火'), (SELECT id FROM tags WHERE name = '城市')),
-- 藏族老人的深邃眼神
((SELECT id FROM photos WHERE title = '藏族老人的深邃眼神'), (SELECT id FROM tags WHERE name = '黑白')),
((SELECT id FROM photos WHERE title = '藏族老人的深邃眼神'), (SELECT id FROM tags WHERE name = '人文')),
((SELECT id FROM photos WHERE title = '藏族老人的深邃眼神'), (SELECT id FROM tags WHERE name = '情绪')),
-- 现代建筑的几何美学
((SELECT id FROM photos WHERE title = '现代建筑的几何美学'), (SELECT id FROM tags WHERE name = '城市')),
((SELECT id FROM photos WHERE title = '现代建筑的几何美学'), (SELECT id FROM tags WHERE name = '极简')),
-- 海边日落的金色时光
((SELECT id FROM photos WHERE title = '海边日落的金色时光'), (SELECT id FROM tags WHERE name = '黄金时刻')),
((SELECT id FROM photos WHERE title = '海边日落的金色时光'), (SELECT id FROM tags WHERE name = '自然')),
-- 雨后街道的宁静时刻
((SELECT id FROM photos WHERE title = '雨后街道的宁静时刻'), (SELECT id FROM tags WHERE name = '街拍')),
((SELECT id FROM photos WHERE title = '雨后街道的宁静时刻'), (SELECT id FROM tags WHERE name = '情绪')),
-- 咖啡馆里的温暖时光
((SELECT id FROM photos WHERE title = '咖啡馆里的温暖时光'), (SELECT id FROM tags WHERE name = '情绪'));

-- 6. 插入评论数据
INSERT INTO comments (photo_id, author_name, author_email, content, is_approved, ip_address) VALUES
((SELECT id FROM photos WHERE title = '晨雾中的桂林山水'), '摄影爱好者小王', 'xiaowang@example.com', '太美了！桂林的山水就是这么迷人，这个角度和时机把握得很好。', true, '192.168.1.100'),
((SELECT id FROM photos WHERE title = '晨雾中的桂林山水'), '旅行达人', 'travel@example.com', '我也去过桂林，但没有拍出这么有诗意的照片。学习了！', true, '192.168.1.101'),
((SELECT id FROM photos WHERE title = '老街巷的午后光影'), '成都本地人', 'chengdu@example.com', '作为成都人，看到这张照片很亲切。宽窄巷子的慢生活被您完美地捕捉到了。', true, '192.168.1.102'),
((SELECT id FROM photos WHERE title = '城市夜景的璀璨灯火'), '夜景摄影师', 'night@example.com', '长曝光技术运用得很好，车流光轨很漂亮。请问用了什么滤镜吗？', true, '192.168.1.103'),
((SELECT id FROM photos WHERE title = '藏族老人的深邃眼神'), '纪实摄影师', 'documentary@example.com', '这张人像照片很有感染力，老人的眼神真的很深邃，黑白处理增强了情感表达。', true, '192.168.1.104'),
((SELECT id FROM photos WHERE title = '海边日落的金色时光'), '风景摄影师', 'landscape@example.com', '黄金时刻拍摄的海景，色彩层次丰富，构图也很棒。', true, '192.168.1.105');

-- 7. 插入点赞数据
INSERT INTO likes (photo_id, ip_address) VALUES
((SELECT id FROM photos WHERE title = '晨雾中的桂林山水'), '192.168.1.100'),
((SELECT id FROM photos WHERE title = '晨雾中的桂林山水'), '192.168.1.101'),
((SELECT id FROM photos WHERE title = '晨雾中的桂林山水'), '192.168.1.102'),
((SELECT id FROM photos WHERE title = '老街巷的午后光影'), '192.168.1.103'),
((SELECT id FROM photos WHERE title = '老街巷的午后光影'), '192.168.1.104'),
((SELECT id FROM photos WHERE title = '城市夜景的璀璨灯火'), '192.168.1.105'),
((SELECT id FROM photos WHERE title = '城市夜景的璀璨灯火'), '192.168.1.106'),
((SELECT id FROM photos WHERE title = '城市夜景的璀璨灯火'), '192.168.1.107'),
((SELECT id FROM photos WHERE title = '藏族老人的深邃眼神'), '192.168.1.108'),
((SELECT id FROM photos WHERE title = '海边日落的金色时光'), '192.168.1.109'),
((SELECT id FROM photos WHERE title = '海边日落的金色时光'), '192.168.1.110');

-- 8. 最终数据统计查询
SELECT '🎉 测试数据导入完成！' as message;
SELECT 
  (SELECT COUNT(*) FROM photos WHERE is_published = true) as 已发布照片数,
  (SELECT COUNT(*) FROM tags) as 标签数量,
  (SELECT COUNT(*) FROM categories) as 分类数量,
  (SELECT COUNT(*) FROM comments WHERE is_approved = true) as 已审核评论数,
  (SELECT COUNT(*) FROM likes) as 点赞数量; 