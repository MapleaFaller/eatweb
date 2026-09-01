/* ============================================================
   data.js —— 数据模块
   作用：集中存放页面的全部静态数据：
        - 门店图标库（shopIcons）
        - 三个食堂的完整数据（食堂 → 楼层 → 门店 → 菜品）
        - 默认公告（DEFAULT_BULLETINS）
        - 随机推荐语库（RECOMMEND_WORDS）
   本文件只声明数据，不含任何渲染逻辑。
   ============================================================ */

// 门店图标库（按顺序循环使用）
const shopIcons = ['fa-store', 'fa-shop', 'fa-store-alt', 'fa-shopping-bag', 'fa-basket-shopping',
    'fa-cart-shopping', 'fa-utensils', 'fa-pizza-slice', 'fa-fish', 'fa-drumstick-bite',
    'fa-bread-slice', 'fa-egg', 'fa-wine-glass', 'fa-cocktail'
];

// ============================================================
//  食堂数据：三个食堂，各楼层，各门店，各菜品
// ============================================================
const canteenData = [{
    id: 'canteen1',
    name: '第一食堂',
    icon: 'fa-building',
    desc: '汇聚中式风味，川湘粤菜与家常美味，满足你的中国胃。从清晨的粥点到深夜的烧烤，每一口都是熟悉的味道。',
    image: 'https://picsum.photos/seed/canteen1/1200/400',
    images: [
        'https://picsum.photos/seed/canteen1-a/1200/400',
        'https://picsum.photos/seed/canteen1-b/1200/400',
        'https://picsum.photos/seed/canteen1-c/1200/400',
    ],
    floors: [{
        id: 'c1f1',
        label: '1F · 风味',
        shops: [{
            id: 'c1f1s1',
            name: '川味小馆',
            desc: '正宗川菜，麻辣鲜香，招牌水煮鱼、辣子鸡深受喜爱。',
            icon: 'fa-pepper-hot',
            image: 'https://picsum.photos/seed/c1f1s1/900/300',
            items: [
                { name: '水煮鱼', price: 56, desc: '麻辣水煮鱼，鱼片鲜嫩，配菜丰富，红油翻滚。',
                    image: 'https://picsum.photos/seed/c1f1s1-shuizhuyu/400/300' },
                { name: '辣子鸡', price: 48, desc: '鸡肉丁炸香，干辣椒花椒爆炒，麻辣干香。',
                    image: 'https://picsum.photos/seed/c1f1s1-laziji/400/300' },
                { name: '麻婆豆腐', price: 28, desc: '麻辣鲜香，豆腐软嫩，牛肉末提味。',
                    image: 'https://picsum.photos/seed/c1f1s1-mapodoufu/400/300' },
                { name: '宫保鸡丁', price: 38, desc: '鸡丁滑嫩，花生酥脆，香辣可口。',
                    image: 'https://picsum.photos/seed/c1f1s1-gongbaojiding/400/300' },
            ]
        }, {
            id: 'c1f1s2',
            name: '粤式茶点',
            desc: '精致广式点心，虾饺、肠粉、烧鹅，地道老广味道。',
            icon: 'fa-mug-saucer',
            image: 'https://picsum.photos/seed/c1f1s2/900/300',
            items: [
                { name: '虾饺', price: 38, desc: '晶莹剔透，虾仁饱满，笋丁提鲜。',
                    image: 'https://picsum.photos/seed/c1f1s2-xiajiao/400/300' },
                { name: '肠粉', price: 26, desc: '米浆蒸制，薄滑透亮，配虾仁或牛肉。',
                    image: 'https://picsum.photos/seed/c1f1s2-changfen/400/300' },
                { name: '烧鹅', price: 78, desc: '广式烧鹅，皮脆肉香，蘸酸梅酱解腻。',
                    image: 'https://picsum.photos/seed/c1f1s2-shaoe/400/300' },
                { name: '白切鸡', price: 58, desc: '清远鸡白切，皮爽肉滑，配姜葱蘸料。',
                    image: 'https://picsum.photos/seed/c1f1s2-baiqieji/400/300' },
            ]
        }]
    }, {
        id: 'c1f2',
        label: '2F · 家常',
        shops: [{
            id: 'c1f2s1',
            name: '家味小厨',
            desc: '家常菜馆，红烧肉、清蒸鲈鱼，每一口都是家的味道。',
            icon: 'fa-utensils',
            image: 'https://picsum.photos/seed/c1f2s1/900/300',
            items: [
                { name: '红烧肉', price: 48, desc: '五花肉炖煮入味，肥而不腻，酱香浓郁。',
                    image: 'https://picsum.photos/seed/c1f2s1-hongshaorou/400/300' },
                { name: '清蒸鲈鱼', price: 56, desc: '鲈鱼鲜美，清蒸保留原味，搭配姜葱豉油。',
                    image: 'https://picsum.photos/seed/c1f2s1-qingzhengluyu/400/300' },
                { name: '蒜蓉西兰花', price: 22, desc: '清爽脆嫩，蒜香四溢，健康低脂。',
                    image: 'https://picsum.photos/seed/c1f2s1-suanrongxilanhua/400/300' },
                { name: '番茄炒蛋', price: 18, desc: '酸甜开胃，鸡蛋嫩滑，经典家常菜。',
                    image: 'https://picsum.photos/seed/c1f2s1-fanqiechaodan/400/300' },
            ]
        }, {
            id: 'c1f2s2',
            name: '干锅坊',
            desc: '干锅系列，花菜、鸡翅、大虾，麻辣干香，越吃越上瘾。',
            icon: 'fa-fire',
            image: 'https://picsum.photos/seed/c1f2s2/900/300',
            items: [
                { name: '干锅花菜', price: 32, desc: '花菜焦香，辣椒花椒爆炒，麻辣干香。',
                    image: 'https://picsum.photos/seed/c1f2s2-ganhuohuacai/400/300' },
                { name: '干锅鸡翅', price: 42, desc: '鸡翅外焦里嫩，麻辣鲜香，配菜丰富。',
                    image: 'https://picsum.photos/seed/c1f2s2-ganhuojichi/400/300' },
                { name: '干锅大虾', price: 52, desc: '大虾鲜甜，干锅做法，麻辣入味。',
                    image: 'https://picsum.photos/seed/c1f2s2-ganhuodaxia/400/300' },
            ]
        }]
    }]
}, {
    id: 'canteen2',
    name: '第二食堂',
    icon: 'fa-spoon',
    desc: '国际美食荟萃，西式牛排、日式料理、精致甜品，一站尝遍世界风味。优雅环境，适合约会与商务宴请。',
    image: 'https://picsum.photos/seed/canteen2/1200/400',
    images: [
        'https://picsum.photos/seed/canteen2-a/1200/400',
        'https://picsum.photos/seed/canteen2-b/1200/400',
        'https://picsum.photos/seed/canteen2-c/1200/400',
    ],
    floors: [{
        id: 'c2f1',
        label: '1F · 西式',
        shops: [{
            id: 'c2f1s1',
            name: '牛排工坊',
            desc: '专业炭烤牛排，安格斯谷饲，外焦里嫩，肉食爱好者天堂。',
            icon: 'fa-utensils',
            image: 'https://picsum.photos/seed/c2f1s1/900/300',
            items: [
                { name: '炭烤牛排', price: 88, desc: '安格斯谷饲牛排，炭火烤制，外焦里嫩，汁水丰盈。',
                    image: 'https://picsum.photos/seed/c2f1s1-steak/400/300' },
                { name: '奶油意面', price: 36, desc: '意面弹牙，奶油酱汁浓郁，配培根和蘑菇。',
                    image: 'https://picsum.photos/seed/c2f1s1-pasta/400/300' },
                { name: '凯撒沙拉', price: 26, desc: '罗马生菜配凯撒酱，面包丁和帕玛森干酪。',
                    image: 'https://picsum.photos/seed/c2f1s1-salad/400/300' },
            ]
        }, {
            id: 'c2f1s2',
            name: '比萨驿站',
            desc: '手工薄底披萨，玛格丽特、榴莲、海鲜，现点现烤。',
            icon: 'fa-pizza-slice',
            image: 'https://picsum.photos/seed/c2f1s2/900/300',
            items: [
                { name: '玛格丽特披萨', price: 58, desc: '传统意式披萨，番茄酱、马苏里拉、罗勒叶。',
                    image: 'https://picsum.photos/seed/c2f1s2-margherita/400/300' },
                { name: '榴莲披萨', price: 68, desc: '榴莲果肉浓郁，芝士拉丝，甜香扑鼻。',
                    image: 'https://picsum.photos/seed/c2f1s2-durian/400/300' },
                { name: '海鲜披萨', price: 72, desc: '鲜虾、鱿鱼、青口，搭配番茄酱和芝士。',
                    image: 'https://picsum.photos/seed/c2f1s2-seafood/400/300' },
            ]
        }]
    }, {
        id: 'c2f2',
        label: '2F · 日式',
        shops: [{
            id: 'c2f2s1',
            name: '鮨·日料',
            desc: '新鲜刺身、手握寿司，食材空运，还原日本味道。',
            icon: 'fa-fish',
            image: 'https://picsum.photos/seed/c2f2s1/900/300',
            items: [
                { name: '三文鱼刺身', price: 68, desc: '新鲜挪威三文鱼，厚切刺身，搭配芥末酱油。',
                    image: 'https://picsum.photos/seed/c2f2s1-sashimi/400/300' },
                { name: '豚骨拉面', price: 42, desc: '猪骨浓汤，叉烧肉，溏心蛋，海苔和葱花。',
                    image: 'https://picsum.photos/seed/c2f2s1-ramen/400/300' },
                { name: '天妇罗虾', price: 48, desc: '鲜虾裹天妇罗衣，炸至金黄，外酥里嫩。',
                    image: 'https://picsum.photos/seed/c2f2s1-tempura/400/300' },
            ]
        }, {
            id: 'c2f2s2',
            name: '咖喱屋',
            desc: '日式咖喱，浓郁微甜，搭配炸猪排、鸡块，米饭杀手。',
            icon: 'fa-utensils',
            image: 'https://picsum.photos/seed/c2f2s2/900/300',
            items: [
                { name: '日式咖喱饭', price: 38, desc: '日式咖喱浓郁微甜，搭配鸡块和米饭。',
                    image: 'https://picsum.photos/seed/c2f2s2-curry/400/300' },
                { name: '炸猪排咖喱', price: 42, desc: '酥脆炸猪排，搭配浓郁咖喱酱汁，下饭神器。',
                    image: 'https://picsum.photos/seed/c2f2s2-katsu/400/300' },
                { name: '咖喱乌冬面', price: 36, desc: 'Q弹乌冬面，裹满咖喱汤汁，温暖治愈。',
                    image: 'https://picsum.photos/seed/c2f2s2-udon/400/300' },
            ]
        }]
    }, {
        id: 'c2f3',
        label: '3F · 甜品',
        shops: [{
            id: 'c2f3s1',
            name: '甜心工坊',
            desc: '法式甜品，提拉米苏、抹茶千层，每一口都是甜蜜。',
            icon: 'fa-cake-candles',
            image: 'https://picsum.photos/seed/c2f3s1/900/300',
            items: [
                { name: '提拉米苏', price: 32, desc: '意大利经典甜品，马斯卡彭芝士，咖啡手指饼。',
                    image: 'https://picsum.photos/seed/c2f3s1-tiramisu/400/300' },
                { name: '抹茶千层', price: 28, desc: '抹茶奶油与薄饼层层叠加，茶香浓郁。',
                    image: 'https://picsum.photos/seed/c2f3s1-matcha/400/300' },
                { name: '焦糖布丁', price: 22, desc: '焦糖脆壳，布丁滑嫩，蛋奶香浓。',
                    image: 'https://picsum.photos/seed/c2f3s1-pudding/400/300' },
                { name: '巧克力熔岩', price: 36, desc: '热巧克力蛋糕，流心内馅，搭配香草冰淇淋。',
                    image: 'https://picsum.photos/seed/c2f3s1-chocolate/400/300' },
            ]
        }, {
            id: 'c2f3s2',
            name: '果茶·冰室',
            desc: '鲜果茶饮，杨枝甘露、多肉葡萄，清爽解腻。',
            icon: 'fa-wine-glass-alt',
            image: 'https://picsum.photos/seed/c2f3s2/900/300',
            items: [
                { name: '杨枝甘露', price: 22, desc: '芒果、西柚、西米，搭配椰奶，清甜爽口。',
                    image: 'https://picsum.photos/seed/c2f3s2-mango/400/300' },
                { name: '多肉葡萄', price: 24, desc: '新鲜葡萄果肉，搭配茉莉花茶底，冰爽解渴。',
                    image: 'https://picsum.photos/seed/c2f3s2-grape/400/300' },
                { name: '芝士莓莓', price: 26, desc: '草莓果肉，芝士奶盖，酸甜绵密。',
                    image: 'https://picsum.photos/seed/c2f3s2-strawberry/400/300' },
            ]
        }]
    }]
}, {
    id: 'canteen3',
    name: '第三食堂',
    icon: 'fa-mug-hot',
    desc: '辣与鲜的碰撞，地道川湘菜与精致粤菜，味蕾的盛宴。从剁椒鱼头到白切鸡，每一道都是匠心之作。',
    image: 'https://picsum.photos/seed/canteen3/1200/400',
    images: [
        'https://picsum.photos/seed/canteen3-a/1200/400',
        'https://picsum.photos/seed/canteen3-b/1200/400',
        'https://picsum.photos/seed/canteen3-c/1200/400',
    ],
    floors: [{
        id: 'c3f1',
        label: '1F · 川湘',
        shops: [{
            id: 'c3f1s1',
            name: '湘味人家',
            desc: '地道湘菜，剁椒鱼头、小炒黄牛肉，辣得够劲。',
            icon: 'fa-pepper-hot',
            image: 'https://picsum.photos/seed/c3f1s1/900/300',
            items: [
                { name: '剁椒鱼头', price: 62, desc: '鱼头鲜美，剁椒酸辣，蒸制入味，香辣过瘾。',
                    image: 'https://picsum.photos/seed/c3f1s1-duojiaoyutou/400/300' },
                { name: '小炒黄牛肉', price: 46, desc: '黄牛肉嫩滑，搭配辣椒、蒜苗，锅气十足。',
                    image: 'https://picsum.photos/seed/c3f1s1-beef/400/300' },
                { name: '毛血旺', price: 52, desc: '血旺、牛百叶、午餐肉，麻辣鲜香，配料丰富。',
                    image: 'https://picsum.photos/seed/c3f1s1-maoxuewang/400/300' },
            ]
        }, {
            id: 'c3f1s2',
            name: '蜀香阁',
            desc: '川菜经典，水煮鱼、回锅肉、麻婆豆腐，巴适得很。',
            icon: 'fa-utensils',
            image: 'https://picsum.photos/seed/c3f1s2/900/300',
            items: [
                { name: '水煮鱼', price: 56, desc: '麻辣水煮鱼，鱼片鲜嫩，配菜丰富，红油翻滚。',
                    image: 'https://picsum.photos/seed/c3f1s2-shuizhuyu/400/300' },
                { name: '回锅肉', price: 42, desc: '五花肉片，蒜苗、豆瓣酱，咸鲜微辣，下饭神器。',
                    image: 'https://picsum.photos/seed/c3f1s2-huiguorou/400/300' },
                { name: '麻婆豆腐', price: 28, desc: '麻辣鲜香，豆腐软嫩，牛肉末提味。',
                    image: 'https://picsum.photos/seed/c3f1s2-mapodoufu/400/300' },
            ]
        }]
    }, {
        id: 'c3f2',
        label: '2F · 粤菜',
        shops: [{
            id: 'c3f2s1',
            name: '粤香楼',
            desc: '传统粤菜，白切鸡、叉烧、煲仔饭，清淡鲜美。',
            icon: 'fa-utensils',
            image: 'https://picsum.photos/seed/c3f2s1/900/300',
            items: [
                { name: '白切鸡', price: 58, desc: '清远鸡白切，皮爽肉滑，配姜葱蘸料。',
                    image: 'https://picsum.photos/seed/c3f2s1-baiqieji/400/300' },
                { name: '叉烧肉', price: 46, desc: '蜜汁叉烧，外焦里嫩，甜咸适口。',
                    image: 'https://picsum.photos/seed/c3f2s1-chashao/400/300' },
                { name: '煲仔饭', price: 38, desc: '砂锅煲制，米饭焦香，配腊味或鸡肉，香气扑鼻。',
                    image: 'https://picsum.photos/seed/c3f2s1-baozai/400/300' },
            ]
        }, {
            id: 'c3f2s2',
            name: '点心坊',
            desc: '广式点心，虾饺、烧卖、凤爪，一盅两件。',
            icon: 'fa-mug-saucer',
            image: 'https://picsum.photos/seed/c3f2s2/900/300',
            items: [
                { name: '虾饺', price: 38, desc: '晶莹剔透，虾仁饱满，笋丁提鲜。',
                    image: 'https://picsum.photos/seed/c3f2s2-xiajiao/400/300' },
                { name: '干蒸烧卖', price: 32, desc: '猪肉虾仁馅，皮薄馅多，鲜香四溢。',
                    image: 'https://picsum.photos/seed/c3f2s2-siumai/400/300' },
                { name: '豉汁凤爪', price: 28, desc: '凤爪软糯，豉汁入味，咸香微辣。',
                    image: 'https://picsum.photos/seed/c3f2s2-fengzhua/400/300' },
                { name: '糯米鸡', price: 26, desc: '荷叶包裹，糯米软糯，鸡肉香菇馅，清香四溢。',
                    image: 'https://picsum.photos/seed/c3f2s2-nuomiji/400/300' },
            ]
        }]
    }]
}];

// ============================================================
//  公告数据（单条示例，直接写入）
// ============================================================
const DEFAULT_BULLETINS = [{
    title: '交我吃test测试',
    content: 'demo功能性测试，补充图库',
    time: new Date(2026, 8, 1).getTime() // 2026年9月1日 00:00
}];

// ============================================================
//  推荐语库（随机推荐视图使用）
// ============================================================
const RECOMMEND_WORDS = [
    '今日必点！人气爆款，吃过都说好。',
    '厨师长力荐，味道超赞，不容错过。',
    '回头客最多的一道菜，墙裂推荐！',
    '当季食材，鲜香四溢，一口入魂。',
    '经典招牌，百吃不厌，进店必尝。',
    '新品上市，惊艳味蕾，速来品尝。',
    '口碑爆棚，麻辣鲜香，回味无穷。',
    '精致摆盘，味道绝佳，适合拍照分享。'
];
