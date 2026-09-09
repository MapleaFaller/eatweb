/* ============================================================
   loader.js —— 本地数据加载模块
   作用：启动时直接读取本地文件作为数据源：
        - 菜品表：data/First.xlsx、Second.xlsx、Third.xlsx
          （每个食堂一个 xlsx；第 1 个 sheet=一楼、第 2 个 sheet=二楼……
           每个 sheet 第 1 行表头 [餐厅, 名称, 价格, 介绍]，
           第 2 行起一行一道菜，同一餐厅的菜连续排在一起）
        - 菜品图片：images/<图片序号>.svg/.png/... 占位示例图
          图片序号 = 食堂号 + 楼层号 + 餐厅号 + 菜序号（十进制拼接），
          例：第一食堂 二楼 第 1 餐厅 第 1 道菜 → 1211
          真实照片优先：images/1211.png > .jpg > .jpeg > .webp > .svg
   依赖：data.js（canteenData 骨架）、js/lib/xlsx.full.min.js（XLSX 全局）
   注意：本文件只定义函数与常量，真正执行入口在 app.js（异步启动）。
   ============================================================ */

// ============================================================
//  数据源配置
// ============================================================
const DATA_DIR = 'data';                              // 存放食堂菜品 xlsx 的目录
const IMG_DIR = 'images';                             // 存放菜品图片的目录
const CANTEEN_FILES = ['First.xlsx', 'Second.xlsx', 'Third.xlsx']; // 与 canteenData 顺序一一对应
const IMG_EXTS = ['png', 'jpg', 'jpeg', 'webp', 'svg'];

// 兜底占位图（无任何图片文件时显示）
const IMG_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f0ebe5" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="sans-serif" font-size="20" fill="%23b8ada2" text-anchor="middle" dominant-baseline="central"%3E🍽%E3%80%80暂无图片%3C/text%3E%3C/svg%3E';

/** 菜品图片探测结果缓存：code -> 最终可用 URL（无则空字符串） */
const dishImageCache = new Map();

// ============================================================
//  单元格工具
// ============================================================

/** 单元格 → 文本（去除首尾空白） */
function cellToStr(v) {
    if (v === null || v === undefined) return '';
    return String(v).replace(/\s+/g, ' ').trim();
}

/** 单元格 → 数字（价格），兼容 "48"、"48元"、"¥48"、"48.5" */
function cellToPrice(v) {
    if (typeof v === 'number') return isFinite(v) ? v : 0;
    const s = cellToStr(v).replace(/[¥￥\s]/g, '').replace(/元$/g, '');
    if (s === '') return 0;
    const n = parseFloat(s);
    return isFinite(n) ? n : 0;
}

// ============================================================
//  图片序号工具（食堂号 + 楼层号 + 餐厅号 + 菜序号）
// ============================================================

/** 从楼层标签（如 "2F · 家常"）中取楼层号 */
function floorNumFromLabel(label) {
    const m = String(label || '').match(/\d+/);
    return m ? parseInt(m[0], 10) : 0;
}

/**
 * 生成菜品图片序号
 * @param {number} canteenIdx  canteenData 下标（+1 得食堂号）
 * @param {number} floorNum    楼层号（取标签里的数字）
 * @param {number} shopIdx1    该楼层第几个餐厅（1 起）
 * @param {number} dishIdx1    该餐厅第几道菜（1 起）
 */
function buildDishCode(canteenIdx, floorNum, shopIdx1, dishIdx1) {
    return `${canteenIdx + 1}${floorNum}${shopIdx1}${dishIdx1}`;
}

/** 一道菜可能的本地图片候选列表（优先级 = 扩展名顺序；小写/大写各试一次，兼容 .PNG/.JPG） */
function dishImageCandidates(item) {
    const urls = [];
    IMG_EXTS.forEach(ext => {
        urls.push(`${IMG_DIR}/${item.code}.${ext}`);
        urls.push(`${IMG_DIR}/${item.code}.${ext.toUpperCase()}`);
    });
    return urls;
}

/** 探测某个 URL 能否正常加载 */
function probeImageUrl(url) {
    return new Promise((resolve) => {
        const im = new Image();
        let done = false;
        const finish = (ok) => {
            if (done) return;
            done = true;
            im.onload = im.onerror = null;
            resolve(ok);
        };
        im.onload = () => finish(true);
        im.onerror = () => finish(false);
        im.src = url;
    });
}

/**
 * 为一道菜解析出可用的本地图片地址（结果缓存到 item._imgUrl）
 * 方式：把全部候选 URL 一次性并行探测，从“加载成功”的候选中
 * 选取优先级最高（扩展名顺序最靠前）的那一个，避免串行逐个请求
 * 造成的等待；无任何可用图片文件时返回 ''（视图层会用兜底占位图）。
 */
async function resolveDishImage(item) {
    if (item._imgUrl !== undefined) return item._imgUrl;
    if (!item.code) { item._imgUrl = ''; return ''; }

    if (dishImageCache.has(item.code)) {
        item._imgUrl = dishImageCache.get(item.code);
        return item._imgUrl;
    }

    const urls = dishImageCandidates(item);
    const settled = await Promise.all(urls.map(url => probeImageUrl(url)));
    const bestIdx = settled.findIndex(ok => ok);
    const url = bestIdx >= 0 ? urls[bestIdx] : '';

    dishImageCache.set(item.code, url);
    item._imgUrl = url;
    return url;
}

/** 并行解析一家店全部菜品图片 */
async function resolveShopImages(shop) {
    if (shop && Array.isArray(shop.items)) {
        await Promise.all(shop.items.map(resolveDishImage));
    }
}

/** 视图层取图统一入口：已解析图片 → 兜底占位图 */
function itemImage(item) {
    const url = (item && item._imgUrl) || '';
    return url.trim() ? url : IMG_PLACEHOLDER;
}

// ============================================================
//  菜品表解析（xlsx → canteenData）
// ============================================================

/** 读取一个食堂 xlsx 中某一楼层 sheet 的全部菜品行（跳过表头） */
function parseFloorSheetRows(wb, sheetIndex) {
    const sheetName = wb.SheetNames && wb.SheetNames[sheetIndex];
    if (!sheetName) return null;
    const ws = wb.Sheets[sheetName];
    if (!ws) return null;
    return XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
}

/**
 * 解析某 sheet：把连续同名餐厅的行分组为餐厅块
 * 返回 [{ name, items:[{name,price,desc}] }]
 */
function groupRowsToShops(rows) {
    const shops = [];
    let cur = null;
    for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        if (!Array.isArray(row)) continue;
        const shopName = cellToStr(row[0]);
        const dishName = cellToStr(row[1]);
        if (!dishName) continue; // 空行 / 无菜名的行跳过
        if (!cur || cur.name !== shopName) {
            cur = { name: shopName || `餐厅${shops.length + 1}`, items: [] };
            shops.push(cur);
        }
        cur.items.push({
            name: dishName,
            price: cellToPrice(row[2]),
            desc: cellToStr(row[3])
        });
    }
    return shops;
}

/** 把解析出的餐厅块写回某楼层的 shops（同名匹配骨架元信息） */
function rebuildFloorShops(canteen, floor, floorIdx, runShops) {
    const rebuilt = [];
    runShops.forEach((run, rIdx) => {
        // 从骨架门店里按名称找元信息（desc / icon / image / id），找不到则用默认值
        const meta = (floor.shops || []).find(s => s.name === run.name) || {};
        const canteenNum = canteenData.indexOf(canteen) + 1;
        const floorNum = floorNumFromLabel(floor.label) || floorIdx + 1;
        const items = run.items.map((it, dIdx) => ({
            ...it,
            code: buildDishCode(canteenNum - 1, floorNum, rIdx + 1, dIdx + 1)
        }));
        rebuilt.push({
            id: meta.id || `${floor.id}s${rIdx + 1}`,
            name: run.name,
            desc: meta.desc || `${canteen.name} · ${floor.label} · ${run.name}`,
            icon: meta.icon || shopIcons[(rIdx + canteenNum * 7) % shopIcons.length],
            image: meta.image || '',
            items
        });
    });
    floor.shops = rebuilt;
}

/**
 * 启动加载：读取全部食堂的 xlsx，填充 canteenData 各家店的 items
 * 返回问题列表（空数组 = 全部成功）。单个食堂失败不影响其他食堂。
 */
async function loadAllData() {
    const problems = [];

    if (typeof XLSX === 'undefined') {
        problems.push('缺少 xlsx 解析库：js/lib/xlsx.full.min.js 未找到。');
        return problems;
    }

    for (let cIdx = 0; cIdx < canteenData.length; cIdx++) {
        const canteen = canteenData[cIdx];
        const file = CANTEEN_FILES[cIdx] || null;
        if (!file) continue;

        try {
            const res = await fetch(`${DATA_DIR}/${file}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const buf = await res.arrayBuffer();
            const wb = XLSX.read(buf, { type: 'array' });

            canteen.floors.forEach((floor, fIdx) => {
                const rows = parseFloorSheetRows(wb, fIdx);
                if (!rows) {
                    floor.shops = [];
                    problems.push(`${canteen.name}(${file}) 缺少第 ${fIdx + 1} 个楼层对应的 sheet（请保持 sheet 顺序 = 楼层顺序：一楼、二楼…）`);
                    return;
                }
                rebuildFloorShops(canteen, floor, fIdx, groupRowsToShops(rows));
            });
        } catch (err) {
            floorShopsToEmpty(canteen);
            const isFileProtocol = typeof location !== 'undefined' && /^file:/.test(location.protocol || '');
            const hint = isFileProtocol
                ? '（file:// 方式打开无法读取 xlsx，请用本地服务器方式打开：见 README / 双击 start-server.bat）'
                : '';
            problems.push(`${canteen.name}(${file}) 读取失败：${err.message || err}${hint}`);
        }
    }
    return problems;
}

/** 某食堂加载失败时把各楼层置空，避免显示脏数据 */
function floorShopsToEmpty(canteen) {
    (canteen.floors || []).forEach((floor) => {
        floor.shops = [];
    });
}

/** 统计当前已加载的总菜品数 */
function countDishes() {
    let n = 0;
    canteenData.forEach(c => c.floors.forEach(f => f.shops.forEach(s => { n += s.items.length; })));
    return n;
}
