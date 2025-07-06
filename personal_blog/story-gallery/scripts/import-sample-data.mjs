import { createClient } from '@supabase/supabase-js'

// 直接使用Supabase配置
const supabaseUrl = 'https://esnwratppwjemtkuzbkw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzbndyYXRwcHdqZW10a3V6Ymt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NTYwNTYsImV4cCI6MjA1MDQzMjA1Nn0.qgo8WuE1hx1_GsOjRiUKN8NTJpfRl8JvJ0UJJTJsBn8'

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function importSampleData() {
  console.log('🚀 开始导入测试数据...\n')
  console.log('🔗 连接到:', supabaseUrl)

  try {
    // 1. 插入分类数据
    console.log('📁 导入分类数据...')
    const categories = [
      { name: '风景摄影', slug: 'landscape', description: '自然风光、山川河流、日出日落等风景类摄影作品', photo_count: 0, sort_order: 1 },
      { name: '人像摄影', slug: 'portrait', description: '人物肖像、情绪表达、生活瞬间等人像类摄影作品', photo_count: 0, sort_order: 2 },
      { name: '街头摄影', slug: 'street', description: '街头巷尾、都市生活、人文纪实等街拍类摄影作品', photo_count: 0, sort_order: 3 },
      { name: '建筑摄影', slug: 'architecture', description: '建筑结构、空间美学、城市天际线等建筑类摄影作品', photo_count: 0, sort_order: 4 },
      { name: '生活摄影', slug: 'life', description: '日常生活、静物、美食等生活类摄影作品', photo_count: 0, sort_order: 5 }
    ]

    const { error: categoriesError } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'name' })

    if (categoriesError) {
      console.error('❌ 插入分类数据失败:', categoriesError)
      return
    }
    console.log('✅ 分类数据导入成功')

    // 2. 插入标签数据
    console.log('🏷️ 导入标签数据...')
    const tags = [
      { name: '黄金时刻', slug: 'golden-hour', description: '黄金时刻拍摄的照片，光线柔和温暖', color: '#F59E0B', photo_count: 0 },
      { name: '长曝光', slug: 'long-exposure', description: '使用长曝光技术拍摄的照片', color: '#8B5CF6', photo_count: 0 },
      { name: '街拍', slug: 'street-photography', description: '街头抓拍的真实生活瞬间', color: '#EF4444', photo_count: 0 },
      { name: '黑白', slug: 'black-white', description: '黑白色调的艺术摄影作品', color: '#6B7280', photo_count: 0 },
      { name: '夜景', slug: 'night-scene', description: '夜间拍摄的城市或自然景观', color: '#1E40AF', photo_count: 0 },
      { name: '人文', slug: 'humanity', description: '体现人文关怀和社会生活的摄影作品', color: '#059669', photo_count: 0 },
      { name: '极简', slug: 'minimalism', description: '极简主义风格的摄影作品', color: '#DC2626', photo_count: 0 },
      { name: '自然', slug: 'nature', description: '自然环境中的生物和景观', color: '#16A34A', photo_count: 0 },
      { name: '城市', slug: 'urban', description: '城市建筑和都市生活场景', color: '#7C3AED', photo_count: 0 },
      { name: '情绪', slug: 'emotion', description: '表达情感和内心世界的摄影作品', color: '#DB2777', photo_count: 0 }
    ]

    const { error: tagsError } = await supabase
      .from('tags')
      .upsert(tags, { onConflict: 'name' })

    if (tagsError) {
      console.error('❌ 插入标签数据失败:', tagsError)
      return
    }
    console.log('✅ 标签数据导入成功')

    // 3. 插入照片数据
    console.log('📸 导入照片数据...')
    const photos = [
      {
        title: '晨雾中的桂林山水',
        description: '桂林漓江边上的经典山水景观，晨雾缭绕，如诗如画。拍摄于清晨6点左右，当时的光线非常柔和，山峰在薄雾中若隐若现，呈现出中国画般的意境。',
        story: '那是一个春天的早晨，我凌晨4点就起床，骑着自行车来到漓江边寻找最佳拍摄点。等待了近两个小时，当第一缕阳光透过云层洒在水面上时，整个世界都安静了下来。远山如黛，近水如镜，那一刻我知道这就是我要的画面。这张照片让我深深爱上了风景摄影，也让我明白了耐心等待的重要性。',
        category: '风景摄影',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=80',
        thumbnail_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80',
        file_name: 'guilin-mountains-morning-mist.jpg',
        file_size: 2456789,
        width: 1200,
        height: 800,
        camera_model: 'Sony A7R IV',
        lens: 'Sony FE 24-70mm f/2.8 GM',
        aperture: 'f/8.0',
        shutter_speed: '1/60s',
        iso: 100,
        focal_length: 35,
        location: '广西桂林市漓江风景区',
        taken_at: '2024-03-15T06:23:00+08:00',
        is_published: true,
        view_count: 234,
        like_count: 45,
        comment_count: 8,
        sort_order: 1,
        featured: true,
        published_at: '2024-03-15T09:30:00+08:00'
      },
      {
        title: '老街巷的午后光影',
        description: '成都宽窄巷子里的一个午后，阳光透过古老的屋檐洒在青石板路上，形成美丽的光影对比。一位老人正在悠闲地喝茶，诠释了慢生活的美好。',
        story: '在成都的那个午后，我漫步在宽窄巷子里，被这里的悠闲氛围深深吸引。看到这位老人独自坐在茶馆门口，阳光恰好从屋檐间洒下，在他身上投下斑驳的影子。我静静地等了十分钟，直到他端起茶杯的那一刻，快门声轻轻响起。这张照片让我感受到了时间的静好，也让我明白了街头摄影的真谛——等待那个决定性的瞬间。',
        category: '街头摄影',
        image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=80',
        thumbnail_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80',
        file_name: 'chengdu-old-street-afternoon.jpg',
        file_size: 1876543,
        width: 1200,
        height: 800,
        camera_model: 'Fujifilm X-T4',
        lens: 'Fujifilm XF 56mm f/1.2 R',
        aperture: 'f/2.8',
        shutter_speed: '1/125s',
        iso: 200,
        focal_length: 56,
        location: '四川成都市锦江区宽窄巷子',
        taken_at: '2024-04-20T14:30:00+08:00',
        is_published: true,
        view_count: 189,
        like_count: 32,
        comment_count: 12,
        sort_order: 2,
        featured: true,
        published_at: '2024-04-20T18:00:00+08:00'
      },
      {
        title: '城市夜景的璀璨灯火',
        description: '上海外滩的夜景，黄浦江两岸的建筑灯火辉煌，倒影在江面上形成美丽的画面。使用长曝光技术，让车流变成了光的河流，整个画面充满了现代都市的活力。',
        story: '这是我第一次尝试城市夜景长曝光摄影。那晚我在外滩等到了晚上9点，架好三脚架，调整好参数，开始了为期2小时的拍摄。看着取景器里车流变成光带，建筑灯光在江面上跳舞，我被这座城市的活力深深震撼了。这张照片不仅记录了上海的美丽夜景，也记录了我对摄影技术的一次突破。',
        category: '建筑摄影',
        image_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=80',
        thumbnail_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80',
        file_name: 'shanghai-bund-night-skyline.jpg',
        file_size: 3245678,
        width: 1200,
        height: 800,
        camera_model: 'Canon EOS R5',
        lens: 'Canon RF 24-105mm f/4 L IS USM',
        aperture: 'f/11.0',
        shutter_speed: '30s',
        iso: 100,
        focal_length: 24,
        location: '上海市黄浦区外滩',
        taken_at: '2024-05-10T21:15:00+08:00',
        is_published: true,
        view_count: 456,
        like_count: 78,
        comment_count: 15,
        sort_order: 3,
        featured: true,
        published_at: '2024-05-10T23:30:00+08:00'
      },
      {
        title: '藏族老人的深邃眼神',
        description: '在拉萨八角街拍摄的一位藏族老人，他的眼神中透露出岁月的沧桑和内心的宁静。黑白处理增强了画面的情感表达，让人能够感受到西藏文化的深厚底蕴。',
        story: '在拉萨的那几天，我每天都会到八角街转转。这位老人总是坐在同一个地方，手里转着转经筒，嘴里念着经文。第三天的下午，当我经过时，他抬头看了我一眼，那一刻我被他眼中的宁静所打动。征得他的同意后，我为他拍下了这张照片。回到酒店后，我将照片转为黑白，因为我觉得只有这样才能更好地表达他内心的纯净。',
        category: '人像摄影',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=80',
        thumbnail_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80',
        file_name: 'tibetan-elder-portrait-bw.jpg',
        file_size: 1654321,
        width: 1200,
        height: 800,
        camera_model: 'Nikon D850',
        lens: 'Nikon AF-S 85mm f/1.8G',
        aperture: 'f/2.8',
        shutter_speed: '1/200s',
        iso: 400,
        focal_length: 85,
        location: '西藏拉萨市城关区八角街',
        taken_at: '2024-06-08T15:45:00+08:00',
        is_published: true,
        view_count: 345,
        like_count: 67,
        comment_count: 23,
        sort_order: 4,
        featured: true,
        published_at: '2024-06-08T19:00:00+08:00'
      },
      {
        title: '现代建筑的几何美学',
        description: '北京望京SOHO的建筑外观，独特的流线型设计在蓝天白云的映衬下显得格外醒目。通过仰视角度和对称构图，突出了现代建筑的几何美感和设计感。',
        story: '那天路过望京SOHO，被这栋建筑的独特造型深深吸引。我围着建筑走了一圈，寻找最佳的拍摄角度。最终选择了这个仰视的角度，因为它能够最好地展现建筑的流线型设计。等待了20分钟，直到有一朵白云飘过，为画面增添了层次感。现代建筑摄影不仅仅是记录建筑本身，更是要捕捉建筑与环境、光影的完美结合。',
        category: '建筑摄影',
        image_url: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=80',
        thumbnail_url: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80',
        file_name: 'beijing-soho-architecture.jpg',
        file_size: 2876543,
        width: 1200,
        height: 800,
        camera_model: 'Canon EOS R6',
        lens: 'Canon RF 16-35mm f/2.8 L IS USM',
        aperture: 'f/8.0',
        shutter_speed: '1/250s',
        iso: 200,
        focal_length: 16,
        location: '北京市朝阳区望京街道',
        taken_at: '2024-07-12T11:20:00+08:00',
        is_published: true,
        view_count: 278,
        like_count: 54,
        comment_count: 9,
        sort_order: 5,
        featured: false,
        published_at: '2024-07-12T16:45:00+08:00'
      },
      {
        title: '海边日落的金色时光',
        description: '在海南三亚的海边拍摄的日落景象，金色的阳光洒在波光粼粼的海面上，远处的渔船剪影为画面增添了生活气息。这是黄金时刻摄影的完美体现。',
        story: '在三亚的最后一个傍晚，我来到海边等待日落。当太阳慢慢接近海平面时，整个天空都被染成了金黄色。海面上波光粼粼，远处有几艘渔船正在归航。我快速调整相机参数，捕捉到了这个完美的瞬间。这张照片让我想起了海明威的《老人与海》，也让我感受到了大自然的壮美和人类的渺小。',
        category: '风景摄影',
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=80',
        thumbnail_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80',
        file_name: 'sanya-sunset-golden-hour.jpg',
        file_size: 2145678,
        width: 1200,
        height: 800,
        camera_model: 'Nikon D850',
        lens: 'Nikon AF-S 70-200mm f/2.8E FL ED VR',
        aperture: 'f/5.6',
        shutter_speed: '1/500s',
        iso: 200,
        focal_length: 135,
        location: '海南省三亚市天涯海角',
        taken_at: '2024-08-25T18:30:00+08:00',
        is_published: true,
        view_count: 512,
        like_count: 89,
        comment_count: 19,
        sort_order: 6,
        featured: true,
        published_at: '2024-08-25T20:00:00+08:00'
      },
      {
        title: '雨后街道的宁静时刻',
        description: '杭州西湖边的一条小巷，雨后的石板路反射着路灯的光芒，几把彩色的雨伞为黑白的画面增添了一抹亮色。这是一个关于等待和希望的故事。',
        story: '那天下午杭州下了一场大雨，我原本计划去西湖拍摄，但大雨让我改变了计划。雨停后，我在西湖边的小巷里漫步，被雨后的宁静氛围所吸引。看到这几把遗落在路边的雨伞，我突然想到了"雨后彩虹"的寓意。虽然天空中没有彩虹，但这些彩色的雨伞就像是生活中的希望，在灰暗的环境中依然闪闪发光。',
        category: '街头摄影',
        image_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=80',
        thumbnail_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80',
        file_name: 'hangzhou-street-after-rain.jpg',
        file_size: 1987654,
        width: 1200,
        height: 800,
        camera_model: 'Sony A7 III',
        lens: 'Sony FE 35mm f/1.8',
        aperture: 'f/2.8',
        shutter_speed: '1/80s',
        iso: 800,
        focal_length: 35,
        location: '浙江省杭州市西湖区',
        taken_at: '2024-09-03T16:20:00+08:00',
        is_published: true,
        view_count: 167,
        like_count: 28,
        comment_count: 7,
        sort_order: 7,
        featured: false,
        published_at: '2024-09-03T18:30:00+08:00'
      },
      {
        title: '咖啡馆里的温暖时光',
        description: '上海法租界的一家咖啡馆，午后的阳光透过落地窗洒在桌面上，一杯拿铁咖啡冒着热气，旁边放着一本书。这是都市生活中的小确幸。',
        story: '那是一个普通的周末午后，我在上海法租界的小巷里闲逛，被这家咖啡馆的温馨氛围所吸引。我点了一杯拿铁，选择了靠窗的位置坐下。阳光透过玻璃窗洒在桌面上，形成了美丽的光影。我拿出相机，捕捉下了这个宁静的瞬间。这张照片不仅记录了一个美好的午后，也让我思考了在快节奏的都市生活中，我们需要偶尔放慢脚步，享受这些简单的美好。',
        category: '生活摄影',
        image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=80',
        thumbnail_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80',
        file_name: 'shanghai-cafe-afternoon.jpg',
        file_size: 1456789,
        width: 1200,
        height: 800,
        camera_model: 'Fujifilm X-T4',
        lens: 'Fujifilm XF 23mm f/1.4 R',
        aperture: 'f/2.0',
        shutter_speed: '1/60s',
        iso: 400,
        focal_length: 23,
        location: '上海市黄浦区淮海中路',
        taken_at: '2024-10-15T14:45:00+08:00',
        is_published: true,
        view_count: 134,
        like_count: 21,
        comment_count: 5,
        sort_order: 8,
        featured: false,
        published_at: '2024-10-15T17:00:00+08:00'
      }
    ]

    const { data: photosData, error: photosError } = await supabase
      .from('photos')
      .insert(photos)
      .select('id, title')

    if (photosError) {
      console.error('❌ 插入照片数据失败:', photosError)
      return
    }
    console.log('✅ 照片数据导入成功')

    // 4. 获取标签ID用于关联
    const { data: tagsData } = await supabase
      .from('tags')
      .select('id, name')

    const { data: allPhotosData } = await supabase
      .from('photos')
      .select('id, title')

    if (!tagsData || !allPhotosData) {
      console.error('❌ 获取标签或照片数据失败')
      return
    }

    // 创建ID映射
    const tagMap = Object.fromEntries(tagsData.map(tag => [tag.name, tag.id]))
    const photoMap = Object.fromEntries(allPhotosData.map(photo => [photo.title, photo.id]))

    // 5. 插入照片-标签关联数据
    console.log('🔗 导入照片-标签关联数据...')
    const photoTags = [
      // 晨雾中的桂林山水
      { photo_id: photoMap['晨雾中的桂林山水'], tag_id: tagMap['黄金时刻'] },
      { photo_id: photoMap['晨雾中的桂林山水'], tag_id: tagMap['自然'] },
      // 老街巷的午后光影
      { photo_id: photoMap['老街巷的午后光影'], tag_id: tagMap['街拍'] },
      { photo_id: photoMap['老街巷的午后光影'], tag_id: tagMap['人文'] },
      // 城市夜景的璀璨灯火
      { photo_id: photoMap['城市夜景的璀璨灯火'], tag_id: tagMap['夜景'] },
      { photo_id: photoMap['城市夜景的璀璨灯火'], tag_id: tagMap['长曝光'] },
      { photo_id: photoMap['城市夜景的璀璨灯火'], tag_id: tagMap['城市'] },
      // 藏族老人的深邃眼神
      { photo_id: photoMap['藏族老人的深邃眼神'], tag_id: tagMap['黑白'] },
      { photo_id: photoMap['藏族老人的深邃眼神'], tag_id: tagMap['人文'] },
      { photo_id: photoMap['藏族老人的深邃眼神'], tag_id: tagMap['情绪'] },
      // 现代建筑的几何美学
      { photo_id: photoMap['现代建筑的几何美学'], tag_id: tagMap['城市'] },
      { photo_id: photoMap['现代建筑的几何美学'], tag_id: tagMap['极简'] },
      // 海边日落的金色时光
      { photo_id: photoMap['海边日落的金色时光'], tag_id: tagMap['黄金时刻'] },
      { photo_id: photoMap['海边日落的金色时光'], tag_id: tagMap['自然'] },
      // 雨后街道的宁静时刻
      { photo_id: photoMap['雨后街道的宁静时刻'], tag_id: tagMap['街拍'] },
      { photo_id: photoMap['雨后街道的宁静时刻'], tag_id: tagMap['情绪'] },
      // 咖啡馆里的温暖时光
      { photo_id: photoMap['咖啡馆里的温暖时光'], tag_id: tagMap['情绪'] }
    ]

    const { error: photoTagsError } = await supabase
      .from('photo_tags')
      .insert(photoTags)

    if (photoTagsError) {
      console.error('❌ 插入照片-标签关联失败:', photoTagsError)
      return
    }
    console.log('✅ 照片-标签关联数据导入成功')

    // 6. 插入评论数据
    console.log('💬 导入评论数据...')
    const comments = [
      {
        photo_id: photoMap['晨雾中的桂林山水'],
        author_name: '摄影爱好者小王',
        author_email: 'xiaowang@example.com',
        content: '太美了！桂林的山水就是这么迷人，这个角度和时机把握得很好。',
        is_approved: true,
        ip_address: '192.168.1.100'
      },
      {
        photo_id: photoMap['晨雾中的桂林山水'],
        author_name: '旅行达人',
        author_email: 'travel@example.com',
        content: '我也去过桂林，但没有拍出这么有诗意的照片。学习了！',
        is_approved: true,
        ip_address: '192.168.1.101'
      },
      {
        photo_id: photoMap['老街巷的午后光影'],
        author_name: '成都本地人',
        author_email: 'chengdu@example.com',
        content: '作为成都人，看到这张照片很亲切。宽窄巷子的慢生活被您完美地捕捉到了。',
        is_approved: true,
        ip_address: '192.168.1.102'
      },
      {
        photo_id: photoMap['城市夜景的璀璨灯火'],
        author_name: '夜景摄影师',
        author_email: 'night@example.com',
        content: '长曝光技术运用得很好，车流光轨很漂亮。请问用了什么滤镜吗？',
        is_approved: true,
        ip_address: '192.168.1.103'
      },
      {
        photo_id: photoMap['藏族老人的深邃眼神'],
        author_name: '纪实摄影师',
        author_email: 'documentary@example.com',
        content: '这张人像照片很有感染力，老人的眼神真的很深邃，黑白处理增强了情感表达。',
        is_approved: true,
        ip_address: '192.168.1.104'
      },
      {
        photo_id: photoMap['海边日落的金色时光'],
        author_name: '风景摄影师',
        author_email: 'landscape@example.com',
        content: '黄金时刻拍摄的海景，色彩层次丰富，构图也很棒。',
        is_approved: true,
        ip_address: '192.168.1.105'
      }
    ]

    const { error: commentsError } = await supabase
      .from('comments')
      .insert(comments)

    if (commentsError) {
      console.error('❌ 插入评论数据失败:', commentsError)
      return
    }
    console.log('✅ 评论数据导入成功')

    // 7. 插入点赞数据
    console.log('❤️ 导入点赞数据...')
    const likes = [
      { photo_id: photoMap['晨雾中的桂林山水'], ip_address: '192.168.1.100' },
      { photo_id: photoMap['晨雾中的桂林山水'], ip_address: '192.168.1.101' },
      { photo_id: photoMap['晨雾中的桂林山水'], ip_address: '192.168.1.102' },
      { photo_id: photoMap['老街巷的午后光影'], ip_address: '192.168.1.103' },
      { photo_id: photoMap['老街巷的午后光影'], ip_address: '192.168.1.104' },
      { photo_id: photoMap['城市夜景的璀璨灯火'], ip_address: '192.168.1.105' },
      { photo_id: photoMap['城市夜景的璀璨灯火'], ip_address: '192.168.1.106' },
      { photo_id: photoMap['城市夜景的璀璨灯火'], ip_address: '192.168.1.107' },
      { photo_id: photoMap['藏族老人的深邃眼神'], ip_address: '192.168.1.108' },
      { photo_id: photoMap['海边日落的金色时光'], ip_address: '192.168.1.109' },
      { photo_id: photoMap['海边日落的金色时光'], ip_address: '192.168.1.110' }
    ]

    const { error: likesError } = await supabase
      .from('likes')
      .insert(likes)

    if (likesError) {
      console.error('❌ 插入点赞数据失败:', likesError)
      return
    }
    console.log('✅ 点赞数据导入成功')

    // 8. 最终统计
    console.log('\n📊 数据导入完成统计：')
    
    const { data: photoCount } = await supabase
      .from('photos')
      .select('id', { count: 'exact' })
      .eq('is_published', true)
    
    const { data: tagCount } = await supabase
      .from('tags')
      .select('id', { count: 'exact' })
    
    const { data: categoryCount } = await supabase
      .from('categories')
      .select('id', { count: 'exact' })
    
    const { data: commentCount } = await supabase
      .from('comments')
      .select('id', { count: 'exact' })
      .eq('is_approved', true)
    
    const { data: likeCount } = await supabase
      .from('likes')
      .select('id', { count: 'exact' })

    console.log(`✅ 已发布照片：${photoCount?.length || 0} 张`)
    console.log(`✅ 标签数量：${tagCount?.length || 0} 个`)
    console.log(`✅ 分类数量：${categoryCount?.length || 0} 个`)
    console.log(`✅ 已审核评论：${commentCount?.length || 0} 条`)
    console.log(`✅ 点赞数量：${likeCount?.length || 0} 个`)

    console.log('\n🎉 测试数据导入完成！现在可以查看网站效果了。')

  } catch (error) {
    console.error('💥 导入过程中发生错误:', error)
  }
}

// 运行导入脚本
importSampleData() 