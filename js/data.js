/* ============================================================
   data.js —— 骨架数据模块
   作用：集中存放页面的「结构 + 静态文案」：
        - 门店图标库（shopIcons）
        - 三个食堂的骨架（食堂 → 楼层 → 门店 的元信息：名称 / 简介 / 图标 / 店招）
        - 默认公告（DEFAULT_BULLETINS）
        - 随机推荐语库（RECOMMEND_WORDS）
   注意：
        - 本文件不再内置「菜品清单 / 菜品图片」。
        - 菜品（名称 / 价格 / 介绍）由 loader.js 在启动时从本地
          data/*.xlsx 读取并填充到各家店的 items 中；
          菜品图片从本地 images/ 目录读取（images/食堂/楼层/门店/菜名.svg…）。
        - loader.js 会按 xlsx 中餐厅出现的顺序重建每家店的
          shops 列表，并从本骨架中按同名匹配继承门店简介 / 图标等元信息。
   ============================================================ */

// 门店图标库（按顺序循环使用）
const shopIcons = ['fa-store', 'fa-shop', 'fa-store-alt', 'fa-shopping-bag', 'fa-basket-shopping',
    'fa-cart-shopping', 'fa-utensils', 'fa-pizza-slice', 'fa-fish', 'fa-drumstick-bite',
    'fa-bread-slice', 'fa-egg', 'fa-wine-glass', 'fa-cocktail'
];

// ============================================================
//  食堂骨架：三个食堂，各楼层、各门店的元信息（无菜品）
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
            items: []
        }, {
            id: 'c1f1s2',
            name: '粤式茶点',
            desc: '精致广式点心，虾饺、肠粉、烧鹅，地道老广味道。',
            icon: 'fa-mug-saucer',
            image: 'https://picsum.photos/seed/c1f1s2/900/300',
            items: []
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
            items: []
        }, {
            id: 'c1f2s2',
            name: '干锅坊',
            desc: '干锅系列，花菜、鸡翅、大虾，麻辣干香，越吃越上瘾。',
            icon: 'fa-fire',
            image: 'https://picsum.photos/seed/c1f2s2/900/300',
            items: []
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
            items: []
        }, {
            id: 'c2f1s2',
            name: '比萨驿站',
            desc: '手工薄底披萨，玛格丽特、榴莲、海鲜，现点现烤。',
            icon: 'fa-pizza-slice',
            image: 'https://picsum.photos/seed/c2f1s2/900/300',
            items: []
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
            items: []
        }, {
            id: 'c2f2s2',
            name: '咖喱屋',
            desc: '日式咖喱，浓郁微甜，搭配炸猪排、鸡块，米饭杀手。',
            icon: 'fa-utensils',
            image: 'https://picsum.photos/seed/c2f2s2/900/300',
            items: []
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
            items: []
        }, {
            id: 'c2f3s2',
            name: '果茶·冰室',
            desc: '鲜果茶饮，杨枝甘露、多肉葡萄，清爽解腻。',
            icon: 'fa-wine-glass-alt',
            image: 'https://picsum.photos/seed/c2f3s2/900/300',
            items: []
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
            items: []
        }, {
            id: 'c3f1s2',
            name: '蜀香阁',
            desc: '川菜经典，水煮鱼、回锅肉、麻婆豆腐，巴适得很。',
            icon: 'fa-utensils',
            image: 'https://picsum.photos/seed/c3f1s2/900/300',
            items: []
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
            items: []
        }, {
            id: 'c3f2s2',
            name: '点心坊',
            desc: '广式点心，虾饺、烧卖、凤爪，一盅两件。',
            icon: 'fa-mug-saucer',
            image: 'https://picsum.photos/seed/c3f2s2/900/300',
            items: []
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
