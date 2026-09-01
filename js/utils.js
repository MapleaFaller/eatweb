/* ============================================================
   utils.js —— 工具函数模块
   作用：提供与界面无关的通用函数：
        - 公告读取（直接返回数据文件中的默认公告）
        - 数据查找（食堂 / 楼层 / 门店）
        - 菜品汇总与随机选取
        - 时间格式化、图标轮换
   依赖：data.js（使用 canteenData / DEFAULT_BULLETINS / RECOMMEND_WORDS）
   ============================================================ */

// ============================================================
//  公告读取
// ============================================================

/** 读取公告：展示型页面无写入功能，直接返回数据文件中的默认公告 */
function getBulletins() {
    return DEFAULT_BULLETINS;
}

// ============================================================
//  数据查找辅助
// ============================================================

/** 按 id 查找食堂 */
function getCanteen(id) {
    return canteenData.find(c => c.id === id);
}

/** 按食堂 id + 楼层 id 查找楼层 */
function getFloor(canteenId, floorId) {
    const canteen = getCanteen(canteenId);
    if (!canteen) return null;
    return canteen.floors.find(f => f.id === floorId) || null;
}

/** 按食堂 id + 楼层 id + 门店 id 查找门店 */
function getShop(canteenId, floorId, shopId) {
    const floor = getFloor(canteenId, floorId);
    if (!floor) return null;
    return floor.shops.find(s => s.id === shopId) || null;
}

// ============================================================
//  菜品汇总与随机选取
// ============================================================

/** 汇总全部菜品，并附带其所属食堂 / 楼层 / 门店信息 */
function getAllItems() {
    const items = [];
    canteenData.forEach(c => {
        c.floors.forEach(f => {
            f.shops.forEach(s => {
                s.items.forEach(item => {
                    items.push({
                        ...item,
                        canteenName: c.name,
                        canteenId: c.id,
                        floorLabel: f.label,
                        floorId: f.id,
                        shopName: s.name,
                        shopId: s.id,
                        shopDesc: s.desc
                    });
                });
            });
        });
    });
    return items;
}

/** 随机取一道菜品，尽量避免与上一次重复 */
function getRandomItem() {
    const all = getAllItems();
    if (all.length === 0) return null;
    if (all.length === 1) return all[0];

    const sameItem = (a, b) => !!a && !!b && a.shopId === b.shopId && a.name === b.name;
    let item = all[Math.floor(Math.random() * all.length)];
    // 尽量避免与上一次推荐重复
    if (sameItem(item, lastRandomItem)) {
        const rest = all.filter(x => !sameItem(x, lastRandomItem));
        if (rest.length > 0) {
            item = rest[Math.floor(Math.random() * rest.length)];
        }
    }
    return item;
}

/** 随机取一条推荐语 */
function getRandomRecommend() {
    return RECOMMEND_WORDS[Math.floor(Math.random() * RECOMMEND_WORDS.length)];
}

// ============================================================
//  格式化与图标
// ============================================================

/** 时间戳 → "MM-DD HH:mm" 字符串 */
function formatTime(timestamp) {
    const d = new Date(timestamp);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const MM = String(d.getMonth() + 1).padStart(2, '0');
    const DD = String(d.getDate()).padStart(2, '0');
    return `${MM}-${DD} ${hh}:${mm}`;
}

/** 按下标从图标库中取门店图标（循环使用） */
function getShopIcon(index) {
    return shopIcons[index % shopIcons.length];
}
