-- 示例数据插入脚本
-- 注意：在生产环境使用前，请确保Supabase Storage bucket已创建

-- 清理现有数据（可选）
-- DELETE FROM comments;
-- DELETE FROM likes; 
-- DELETE FROM photos;

-- 插入示例照片数据
INSERT INTO photos (
  id,
  title, 
  description,
  file_name,
  file_size,
  width,
  height,
  exif_data,
  tags,
  location,
  taken_at,
  is_published,
  likes_count,
  published_at,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  '夕阳下的山峦',
  '在黄昏时分，远山如画，夕阳西下，天空被染成金黄色，这一刻的美好值得永远记住。',
  'sunset-mountains.jpg',
  2048000,
  1920,
  1080,
  '{"camera": "Canon EOS R5", "lens": "RF 24-70mm f/2.8", "aperture": "2.8", "shutter_speed": "1/125", "iso": 100, "focal_length": "50"}',
  ARRAY['风景', '山川', '夕阳', '自然'],
  '云南大理',
  '2024-12-15 18:30:00+00',
  true,
  23,
  '2024-12-22 10:00:00+00',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '城市夜景',
  '繁华都市的夜晚，霓虹灯闪烁，车流如河，展现现代城市的活力与魅力。',
  'city-night.jpg',
  1567000,
  1600,
  1200,
  '{"camera": "Sony A7R IV", "lens": "FE 16-35mm f/2.8", "aperture": "8.0", "shutter_speed": "8", "iso": 200, "focal_length": "24"}',
  ARRAY['城市', '夜景', '霓虹', '建筑'],
  '上海外滩',
  '2024-12-10 20:45:00+00',
  true,
  45,
  '2024-12-22 10:30:00+00',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '海边日出',
  '清晨第一缕阳光照耀在海面上，波光粼粼，海鸥飞翔，新的一天充满希望。',
  'sunrise-sea.jpg',
  1890000,
  1800,
  1350,
  '{"camera": "Nikon Z9", "lens": "Z 70-200mm f/2.8", "aperture": "5.6", "shutter_speed": "1/200", "iso": 320, "focal_length": "135"}',
  ARRAY['海景', '日出', '自然', '希望'],
  '青岛金沙滩',
  '2024-12-08 06:15:00+00',
  true,
  67,
  '2024-12-22 11:00:00+00',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '雨后彩虹',
  '一场夏日暴雨过后，天空出现了完整的彩虹，横跨在绿色的田野上方，大自然的奇迹总是让人惊叹。',
  'rainbow-field.jpg',
  1234000,
  1600,
  900,
  '{"camera": "Canon EOS R6", "lens": "EF 24-105mm f/4", "aperture": "11", "shutter_speed": "1/60", "iso": 400, "focal_length": "85"}',
  ARRAY['彩虹', '田野', '雨后', '自然奇观'],
  '内蒙古呼伦贝尔',
  '2024-12-05 15:20:00+00',
  true,
  34,
  '2024-12-22 11:30:00+00',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '雪山倒影',
  '高原湖泊清澈如镜，雪山倒影其中，蓝天白云与雪峰交相辉映，构成了一幅完美的画卷。',
  'snow-mountain-reflection.jpg',
  2345000,
  2000,
  1333,
  '{"camera": "Fujifilm X-T5", "lens": "XF 16-80mm f/4", "aperture": "8.0", "shutter_speed": "1/125", "iso": 160, "focal_length": "35"}',
  ARRAY['雪山', '湖泊', '倒影', '高原'],
  '西藏纳木错',
  '2024-12-01 14:00:00+00',
  true,
  89,
  '2024-12-22 12:00:00+00',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '古镇小巷',
  '江南古镇的青石板路，两旁是白墙黛瓦的传统建筑，时光在这里仿佛慢了下来。',
  'ancient-town-alley.jpg',
  1678000,
  1200,
  1600,
  '{"camera": "Leica Q2", "lens": "Summilux 28mm f/1.7", "aperture": "4.0", "shutter_speed": "1/80", "iso": 200, "focal_length": "28"}',
  ARRAY['古镇', '江南', '传统建筑', '文化'],
  '浙江乌镇',
  '2024-11-28 16:30:00+00',
  true,
  52,
  '2024-12-22 12:30:00+00',
  NOW(),
  NOW()
);

-- 插入示例评论数据
INSERT INTO comments (
  photo_id,
  author_name,
  author_email,
  content,
  is_approved,
  created_at
) VALUES 
(
  (SELECT id FROM photos WHERE title = '夕阳下的山峦' LIMIT 1),
  '摄影爱好者',
  'photo@example.com',
  '太美了！这种光线抓得真好，夕阳的温暖色调和山峦的轮廓形成了完美的对比。',
  true,
  NOW() - INTERVAL '2 days'
),
(
  (SELECT id FROM photos WHERE title = '城市夜景' LIMIT 1),
  '都市行者',
  'urban@example.com',
  '上海的夜景总是那么迷人，这张照片很好地展现了城市的活力。',
  true,
  NOW() - INTERVAL '1 day'
),
(
  (SELECT id FROM photos WHERE title = '海边日出' LIMIT 1),
  '自然追随者',
  'nature@example.com',
  '日出的那一刻总是充满希望，这张照片让我想起了内心的平静。',
  true,
  NOW() - INTERVAL '3 hours'
);

-- 插入示例点赞数据
INSERT INTO likes (
  photo_id,
  user_ip,
  created_at
) VALUES 
(
  (SELECT id FROM photos WHERE title = '夕阳下的山峦' LIMIT 1),
  '192.168.1.100',
  NOW() - INTERVAL '1 day'
),
(
  (SELECT id FROM photos WHERE title = '城市夜景' LIMIT 1),
  '192.168.1.101',
  NOW() - INTERVAL '2 hours'
),
(
  (SELECT id FROM photos WHERE title = '海边日出' LIMIT 1),
  '192.168.1.102',
  NOW() - INTERVAL '30 minutes'
);

-- 创建视图统计数据的函数（如果需要）
CREATE OR REPLACE FUNCTION increment_photo_views(photo_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE photos 
  SET view_count = view_count + 1 
  WHERE id = photo_id;
END;
$$ LANGUAGE plpgsql; 