/* ============================================================
   menu-content-breakfast.js —— dev-tools 早餐种子数据
   用途：build.js 用它生成：
      1) data/breakfast/First.xlsx、Second.xlsx、Third.xlsx（早餐表，
         格式与正餐表 data/*.xlsx 完全相同）
      2) images-breakfast/ 多级目录下的 .svg 早餐占位示例图
         （images-breakfast/<食堂名>/<楼层标签>/<门店名>/<菜名>.svg）
   注意：
      - 只有「供应早餐」的门店才写在这里；**没有出现的门店 = 无早餐**，
        页面在早餐模式下会在该窗口的菜品目录显示「无早餐」。
      - 楼层必须全部列出（即使该楼层没有任何窗口供应早餐，也要写
        shops: []），因为 sheet 顺序必须与 js/data.js 中的楼层顺序一致。
      - 门店名 / 菜名要与正餐表（menu-content.js）中的写法保持一致，
        页面才能正确匹配门店与图片目录。
   ============================================================ */

module.exports = [
    {
        file: 'First.xlsx',   // 第一食堂
        floors: [
            {
                sheet: '1F · 风味',
                shops: [
                    {
                        name: '粤式茶点',   // 早茶窗口
                        items: [
                            { name: '虾饺', price: 22, desc: '水晶虾饺，皮薄馅足，早茶必点。' },
                            { name: '干蒸烧卖', price: 18, desc: '猪肉虾仁烧卖，鲜香多汁。' },
                            { name: '蜜汁叉烧包', price: 16, desc: '松软面皮，蜜汁叉烧馅，甜咸适口。' },
                            { name: '皮蛋瘦肉粥', price: 12, desc: '米粒绵软，皮蛋瘦肉咸香开胃。' },
                            { name: '香煎萝卜糕', price: 14, desc: '外焦里嫩，萝卜清甜，配辣椒酱更佳。' }
                        ]
                    }
                    // 川味小馆：不供应早餐（不在本表中出现）
                ]
            },
            {
                sheet: '2F · 家常',
                shops: [
                    {
                        name: '家味小厨',   // 家常早餐
                        items: [
                            { name: '现磨豆浆', price: 4, desc: '石磨豆浆，浓香微甜，可选无糖。' },
                            { name: '手工油条', price: 3, desc: '现炸油条，外脆内软，配豆浆一绝。' },
                            { name: '鲜肉小笼包', price: 12, desc: '皮薄汁多，鲜肉馅现包现蒸。' },
                            { name: '茶叶蛋', price: 3, desc: '卤香入味，蛋黄绵密。' },
                            { name: '南瓜小米粥', price: 8, desc: '小米与南瓜慢熬，温润养胃。' }
                        ]
                    }
                    // 干锅坊：不供应早餐
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
                        name: '比萨驿站',   // 西式早餐
                        items: [
                            { name: '黄油可颂', price: 12, desc: '层层酥脆，黄油香气浓郁。' },
                            { name: '火腿芝士三明治', price: 16, desc: '烘烤吐司夹火腿芝士，配生菜。' },
                            { name: '美式咖啡', price: 10, desc: '现磨咖啡，清爽提神。' },
                            { name: '煎蛋培根吐司', price: 18, desc: '太阳蛋、培根与吐司，经典西式早餐。' }
                        ]
                    }
                    // 牛排工坊：不供应早餐
                ]
            },
            {
                sheet: '2F · 日式',
                shops: [
                    {
                        name: '咖喱屋',     // 日式早餐
                        items: [
                            { name: '三文鱼饭团', price: 10, desc: '海苔包裹，三文鱼咸香，方便携带。' },
                            { name: '味噌汤', price: 8, desc: '豆腐裙带菜味噌汤，暖胃开胃。' },
                            { name: '玉子烧', price: 12, desc: '日式厚蛋烧，微甜软嫩。' }
                        ]
                    }
                    // 鮨·日料：不供应早餐
                ]
            },
            {
                sheet: '3F · 甜品',
                shops: []   // 甜品楼层整体不供应早餐（窗口均显示「无早餐」）
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
                        name: '湘味人家',   // 湖南早餐
                        items: [
                            { name: '牛肉米粉', price: 14, desc: '湖南米粉，牛肉码子香辣过瘾。' },
                            { name: '糖油粑粑', price: 8, desc: '外糯内软，甜香扑鼻。' },
                            { name: '擂茶', price: 6, desc: '花生芝麻擂茶，咸香解腻。' }
                        ]
                    }
                    // 蜀香阁：不供应早餐
                ]
            },
            {
                sheet: '2F · 粤菜',
                shops: [
                    {
                        name: '粤香楼',     // 广式早茶
                        items: [
                            { name: '艇仔粥', price: 14, desc: '鱼片、花生、油条碎，料足绵滑。' },
                            { name: '干炒牛河', price: 20, desc: '镬气十足，牛肉嫩滑，河粉干爽。' },
                            { name: '豉汁凤爪', price: 18, desc: '凤爪软糯，豉汁咸香。' },
                            { name: '叉烧酥', price: 15, desc: '酥皮层层，叉烧馅甜咸交织。' }
                        ]
                    },
                    {
                        name: '点心坊',     // 早茶点心
                        items: [
                            { name: '虾饺', price: 20, desc: '水晶皮虾饺，鲜虾饱满。' },
                            { name: '流沙包', price: 14, desc: '咸蛋黄流沙馅，趁热更香。' },
                            { name: '葡式蛋挞', price: 10, desc: '挞皮酥脆，蛋香浓郁。' },
                            { name: '糯米鸡', price: 16, desc: '荷叶清香，糯米软糯咸香。' },
                            { name: '干蒸烧卖', price: 16, desc: '猪肉虾仁烧卖，皮薄馅多。' }
                        ]
                    }
                ]
            }
        ]
    }
];
