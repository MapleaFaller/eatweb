/* ============================================================
   menu-content.js —— dev-tools 一次性种子数据
   用途：build.js 用它生成：
      1) data/First.xlsx、Second.xlsx、Third.xlsx（页面运行时的唯一菜品数据源）
      2) images/*.svg 占位示例图（文件名为图片序号，如 1211.svg）
   注意：
      - 本项目“线上”数据以 data/ 下的 xlsx 为准（直接改 xlsx 即可生效）；
        本文件只用于首次生成 / 重新初始化示例数据。
      - canteen 顺序、floors 顺序、每家店的 items 顺序决定图片序号，
        与 data.js 中的骨架（食堂/楼层/门店元信息）必须一一对应。
   ============================================================ */

module.exports = [
    {
        file: 'First.xlsx',   // 第一食堂
        floors: [
            {
                sheet: '1F · 风味',
                shops: [
                    {
                        name: '川味小馆',
                        items: [
                            { name: '水煮鱼', price: 56, desc: '麻辣水煮鱼，鱼片鲜嫩，配菜丰富，红油翻滚。' },
                            { name: '辣子鸡', price: 48, desc: '鸡肉丁炸香，干辣椒花椒爆炒，麻辣干香。' },
                            { name: '麻婆豆腐', price: 28, desc: '麻辣鲜香，豆腐软嫩，牛肉末提味。' },
                            { name: '宫保鸡丁', price: 38, desc: '鸡丁滑嫩，花生酥脆，香辣可口。' }
                        ]
                    },
                    {
                        name: '粤式茶点',
                        items: [
                            { name: '虾饺', price: 38, desc: '晶莹剔透，虾仁饱满，笋丁提鲜。' },
                            { name: '肠粉', price: 26, desc: '米浆蒸制，薄滑透亮，配虾仁或牛肉。' },
                            { name: '烧鹅', price: 78, desc: '广式烧鹅，皮脆肉香，蘸酸梅酱解腻。' },
                            { name: '白切鸡', price: 58, desc: '清远鸡白切，皮爽肉滑，配姜葱蘸料。' }
                        ]
                    }
                ]
            },
            {
                sheet: '2F · 家常',
                shops: [
                    {
                        name: '家味小厨',
                        items: [
                            { name: '红烧肉', price: 48, desc: '五花肉炖煮入味，肥而不腻，酱香浓郁。' },
                            { name: '清蒸鲈鱼', price: 56, desc: '鲈鱼鲜美，清蒸保留原味，搭配姜葱豉油。' },
                            { name: '蒜蓉西兰花', price: 22, desc: '清爽脆嫩，蒜香四溢，健康低脂。' },
                            { name: '番茄炒蛋', price: 18, desc: '酸甜开胃，鸡蛋嫩滑，经典家常菜。' }
                        ]
                    },
                    {
                        name: '干锅坊',
                        items: [
                            { name: '干锅花菜', price: 32, desc: '花菜焦香，辣椒花椒爆炒，麻辣干香。' },
                            { name: '干锅鸡翅', price: 42, desc: '鸡翅外焦里嫩，麻辣鲜香，配菜丰富。' },
                            { name: '干锅大虾', price: 52, desc: '大虾鲜甜，干锅做法，麻辣入味。' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        file: 'Second.xlsx',  // 第二食堂
        floors: [
            {
                sheet: '1F · 西式',
                shops: [
                    {
                        name: '牛排工坊',
                        items: [
                            { name: '炭烤牛排', price: 88, desc: '安格斯谷饲牛排，炭火烤制，外焦里嫩，汁水丰盈。' },
                            { name: '奶油意面', price: 36, desc: '意面弹牙，奶油酱汁浓郁，配培根和蘑菇。' },
                            { name: '凯撒沙拉', price: 26, desc: '罗马生菜配凯撒酱，面包丁和帕玛森干酪。' }
                        ]
                    },
                    {
                        name: '比萨驿站',
                        items: [
                            { name: '玛格丽特披萨', price: 58, desc: '传统意式披萨，番茄酱、马苏里拉、罗勒叶。' },
                            { name: '榴莲披萨', price: 68, desc: '榴莲果肉浓郁，芝士拉丝，甜香扑鼻。' },
                            { name: '海鲜披萨', price: 72, desc: '鲜虾、鱿鱼、青口，搭配番茄酱和芝士。' }
                        ]
                    }
                ]
            },
            {
                sheet: '2F · 日式',
                shops: [
                    {
                        name: '鮨·日料',
                        items: [
                            { name: '三文鱼刺身', price: 68, desc: '新鲜挪威三文鱼，厚切刺身，搭配芥末酱油。' },
                            { name: '豚骨拉面', price: 42, desc: '猪骨浓汤，叉烧肉，溏心蛋，海苔和葱花。' },
                            { name: '天妇罗虾', price: 48, desc: '鲜虾裹天妇罗衣，炸至金黄，外酥里嫩。' }
                        ]
                    },
                    {
                        name: '咖喱屋',
                        items: [
                            { name: '日式咖喱饭', price: 38, desc: '日式咖喱浓郁微甜，搭配鸡块和米饭。' },
                            { name: '炸猪排咖喱', price: 42, desc: '酥脆炸猪排，搭配浓郁咖喱酱汁，下饭神器。' },
                            { name: '咖喱乌冬面', price: 36, desc: 'Q弹乌冬面，裹满咖喱汤汁，温暖治愈。' }
                        ]
                    }
                ]
            },
            {
                sheet: '3F · 甜品',
                shops: [
                    {
                        name: '甜心工坊',
                        items: [
                            { name: '提拉米苏', price: 32, desc: '意大利经典甜品，马斯卡彭芝士，咖啡手指饼。' },
                            { name: '抹茶千层', price: 28, desc: '抹茶奶油与薄饼层层叠加，茶香浓郁。' },
                            { name: '焦糖布丁', price: 22, desc: '焦糖脆壳，布丁滑嫩，蛋奶香浓。' },
                            { name: '巧克力熔岩', price: 36, desc: '热巧克力蛋糕，流心内馅，搭配香草冰淇淋。' }
                        ]
                    },
                    {
                        name: '果茶·冰室',
                        items: [
                            { name: '杨枝甘露', price: 22, desc: '芒果、西柚、西米，搭配椰奶，清甜爽口。' },
                            { name: '多肉葡萄', price: 24, desc: '新鲜葡萄果肉，搭配茉莉花茶底，冰爽解渴。' },
                            { name: '芝士莓莓', price: 26, desc: '草莓果肉，芝士奶盖，酸甜绵密。' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        file: 'Third.xlsx',   // 第三食堂
        floors: [
            {
                sheet: '1F · 川湘',
                shops: [
                    {
                        name: '湘味人家',
                        items: [
                            { name: '剁椒鱼头', price: 62, desc: '鱼头鲜美，剁椒酸辣，蒸制入味，香辣过瘾。' },
                            { name: '小炒黄牛肉', price: 46, desc: '黄牛肉嫩滑，搭配辣椒、蒜苗，锅气十足。' },
                            { name: '毛血旺', price: 52, desc: '血旺、牛百叶、午餐肉，麻辣鲜香，配料丰富。' }
                        ]
                    },
                    {
                        name: '蜀香阁',
                        items: [
                            { name: '水煮鱼', price: 56, desc: '麻辣水煮鱼，鱼片鲜嫩，配菜丰富，红油翻滚。' },
                            { name: '回锅肉', price: 42, desc: '五花肉片，蒜苗、豆瓣酱，咸鲜微辣，下饭神器。' },
                            { name: '麻婆豆腐', price: 28, desc: '麻辣鲜香，豆腐软嫩，牛肉末提味。' }
                        ]
                    }
                ]
            },
            {
                sheet: '2F · 粤菜',
                shops: [
                    {
                        name: '粤香楼',
                        items: [
                            { name: '白切鸡', price: 58, desc: '清远鸡白切，皮爽肉滑，配姜葱蘸料。' },
                            { name: '叉烧肉', price: 46, desc: '蜜汁叉烧，外焦里嫩，甜咸适口。' },
                            { name: '煲仔饭', price: 38, desc: '砂锅煲制，米饭焦香，配腊味或鸡肉，香气扑鼻。' }
                        ]
                    },
                    {
                        name: '点心坊',
                        items: [
                            { name: '虾饺', price: 38, desc: '晶莹剔透，虾仁饱满，笋丁提鲜。' },
                            { name: '干蒸烧卖', price: 32, desc: '猪肉虾仁馅，皮薄馅多，鲜香四溢。' },
                            { name: '豉汁凤爪', price: 28, desc: '凤爪软糯，豉汁入味，咸香微辣。' },
                            { name: '糯米鸡', price: 26, desc: '荷叶包裹，糯米软糯，鸡肉香菇馅，清香四溢。' }
                        ]
                    }
                ]
            }
        ]
    }
];
