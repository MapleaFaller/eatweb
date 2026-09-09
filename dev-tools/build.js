/* ============================================================
   build.js —— dev-tools 生成脚本（Node 运行，无需安装依赖）
   用法：  node dev-tools/build.js
   生成内容（相对 ver0.2 根目录）：
      1) data/First.xlsx  Second.xlsx  Third.xlsx
         每个食堂一个 xlsx；第一个 sheet=一楼、第二个 sheet=二楼……
         每个 sheet：第 1 行表头 [餐厅, 名称, 价格, 介绍]，
         第 2 行起一行一道菜（同一餐厅的菜连续排列，A 列写餐厅名）。
         因此“第一食堂二楼第一个餐厅第一道菜”位于 First.xlsx
         sheet2 的 B2（第二列第二行）。
      2) images/<图片序号>.svg 占位示例图
         图片序号 = 食堂号 + 楼层号 + 餐厅号 + 菜序号（均为 1 位十进制），
         例：第一食堂 二楼 第 1 餐厅 第 1 道菜 = 1211.svg。
   依赖：../js/lib/xlsx.full.min.js（SheetJS，本地已放好）
   ============================================================ */

const path = require('path');
const fs = require('fs');
const XLSX = require(path.join(__dirname, '..', 'js', 'lib', 'xlsx.full.min.js'));

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const IMG_DIR = path.join(ROOT, 'images');

const CONTENT = require('./menu-content.js');

const HEADER = ['餐厅', '名称', '价格', '介绍'];

/* 楼层号：从 sheet 名/楼层标签中取第一个数字（与浏览器端 loader 同规则） */
function floorNumFromLabel(label) {
    const m = String(label).match(/\d+/);
    return m ? parseInt(m[0], 10) : 0;
}

/* 图片序号 = 食堂号 + 楼层号 + 餐厅号 + 菜序号 */
function dishCode(canteenNum, floorNum, shopIdx1, dishIdx1) {
    return `${canteenNum}${floorNum}${shopIdx1}${dishIdx1}`;
}

function escXml(s) {
    return String(s).replace(/[<>&'"]/g, (c) => ({
        '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
    }[c]));
}

/* 每道菜用的占位表情（按序号轮换，让示例图略有区别） */
const EMOJIS = ['🍚', '🍜', '🍝', '🍛', '🍲', '🥘', '🍱', '🥟', '🍤', '🥩', '🍗', '🍕', '🍣', '🍰', '🧋', '🥗', '🍢', '🍞', '🍵', '🌶', '🫔', '🦐', '🐟'];

/* 每个食堂一套配色（渐变起止色） */
const PALETTES = {
    1: ['#FFE0A3', '#FF9A5A'], // 第一食堂 · 暖橙
    2: ['#BFE9FF', '#4FACFE'], // 第二食堂 · 天蓝
    3: ['#E8D5F5', '#B490D9']  // 第三食堂 · 淡紫
};

function makeSvg(code, canteenNum, meta) {
    const [c1, c2] = PALETTES[canteenNum] || PALETTES[1];
    const emoji = EMOJIS[String(code).split('').reduce((a, b) => a + +b, 0) % EMOJIS.length];
    const price = Number(meta.price) || 0;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" rx="18" fill="url(#bg)"/>
  <circle cx="330" cy="40" r="70" fill="#ffffff" opacity="0.18"/>
  <circle cx="60" cy="270" r="90" fill="#ffffff" opacity="0.12"/>
  <g>
    <rect x="14" y="14" width="150" height="30" rx="15" fill="#ffffff" opacity="0.85"/>
    <text x="89" y="34" font-family="Segoe UI, Microsoft YaHei, sans-serif" font-size="15" font-weight="700" fill="#8a6d3b" text-anchor="middle">示例图 #${code}</text>
  </g>
  <text x="200" y="150" font-size="100" text-anchor="middle">${emoji}</text>
  <rect x="272" y="236" width="104" height="44" rx="22" fill="#ffffff" opacity="0.92"/>
  <text x="324" y="266" font-family="Segoe UI, Microsoft YaHei, sans-serif" font-size="22" font-weight="700" fill="#c0392b" text-anchor="middle">¥${price}</text>
  <text x="24" y="266" font-family="Segoe UI, Microsoft YaHei, sans-serif" font-size="30" font-weight="700" fill="#ffffff">${escXml(meta.name)}</text>
  <text x="24" y="288" font-family="Segoe UI, Microsoft YaHei, sans-serif" font-size="13" fill="#ffffff" opacity="0.85">${escXml(meta.canteen)} · ${escXml(meta.floor)} · ${escXml(meta.shop)}</text>
</svg>
`;
}

function sheetFromFloor(floor) {
    const rows = [HEADER.slice()];
    floor.shops.forEach((shop) => {
        shop.items.forEach((it) => {
            rows.push([shop.name, it.name, Number(it.price) || 0, it.desc || '']);
        });
    });
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [
        { wch: 14 },   // 餐厅
        { wch: 18 },   // 名称
        { wch: 8 },    // 价格
        { wch: 55 }    // 介绍
    ];
    return ws;
}

function build() {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.mkdirSync(IMG_DIR, { recursive: true });

    const allCodes = [];      // code -> { dish, file }
    let dishTotal = 0;
    const problems = [];

    CONTENT.forEach((canteen, cIdx) => {
        const canteenNum = cIdx + 1;
        const wb = XLSX.utils.book_new();
        const floorSheets = []; // {floor, ws, sheetName}

        canteen.floors.forEach((floor) => {
            const ws = sheetFromFloor(floor);
            const sheetName = floor.sheet && floor.sheet.length <= 31 ? floor.sheet : `F${floorNumFromLabel(floor.sheet) || canteen.floors.indexOf(floor) + 1}`;
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
            floorSheets.push({ floor, ws });
        });

        const outBuf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
        fs.writeFileSync(path.join(DATA_DIR, canteen.file), outBuf);
        console.log(`✔ 生成 ${canteen.file}（${floorSheets.length} 个 sheet）`);

        // 生成占位图 + 记录序号
        floorSheets.forEach(({ floor }) => {
            const floorNum = floorNumFromLabel(floor.sheet);
            floor.shops.forEach((shop, shopIdx) => {
                shop.items.forEach((it, dishIdx) => {
                    const code = dishCode(canteenNum, floorNum, shopIdx + 1, dishIdx + 1);
                    if (allCodes.includes(code)) {
                        problems.push(`图片序号重复：${code}（${canteen.file} ${floor.sheet} / ${shop.name} / ${it.name}）`);
                    }
                    allCodes.push(code);
                    dishTotal++;
                    const meta = {
                        name: it.name,
                        price: it.price,
                        canteen: `第${canteenNum}食堂`,
                        floor: floor.sheet,
                        shop: shop.name
                    };
                    fs.writeFileSync(path.join(IMG_DIR, `${code}.svg`), makeSvg(code, canteenNum, meta));
                });
            });
        });
    });

    // 校验：重新读取 xlsx，确认 B2 = 每个楼层第一个餐厅第一道菜的名称
    let pass = true;
    CONTENT.forEach((canteen, cIdx) => {
        const canteenNum = cIdx + 1;
        const wb = XLSX.read(fs.readFileSync(path.join(DATA_DIR, canteen.file)), { type: 'buffer' });
        if (wb.SheetNames.length !== canteen.floors.length) {
            problems.push(`${canteen.file} sheet 数量 ${wb.SheetNames.length} ≠ ${canteen.floors.length}`);
            pass = false;
        }
        wb.SheetNames.forEach((name, fi) => {
            const floor = canteen.floors[fi];
            if (!floor) return;
            const ws = wb.Sheets[name];
            const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
            const expectFirst = floor.shops.length ? floor.shops[0].items[0].name : null;
            const b2 = rows[1] ? rows[1][1] : '';
            if (expectFirst !== null && String(b2).trim() !== expectFirst) {
                problems.push(`${canteen.file} ${name} B2 期望「${expectFirst}」实际「${b2}」`);
                pass = false;
            }
            let rowCount = 0;
            for (let r = 1; r < rows.length; r++) {
                if (rows[r] && String(rows[r][1] || '').trim()) rowCount++;
            }
            const expectCount = floor.shops.reduce((s, sh) => s + sh.items.length, 0);
            if (rowCount !== expectCount) {
                problems.push(`${canteen.file} ${name} 菜品行数 ${rowCount} ≠ ${expectCount}`);
                pass = false;
            }
        });
    });

    const codeFiles = fs.readdirSync(IMG_DIR).filter((f) => f.endsWith('.svg') && /^\d+\.svg$/.test(f)).map((f) => f.replace('.svg', ''));
    const missing = allCodes.filter((c) => !codeFiles.includes(c));
    const extra = codeFiles.filter((c) => !allCodes.includes(c));

    if (missing.length) { problems.push(`缺图片：${missing.join(',')}`); pass = false; }
    if (extra.length) { problems.push(`多余图片文件：${extra.join(',')}`); pass = false; }
    if (!codeFiles.includes('1211')) { problems.push('必须包含示例图片 1211.svg'); pass = false; }

    console.log(`菜品总数：${dishTotal}；图片文件数：${codeFiles.length}`);
    console.log(`示例：1211（第一食堂·二楼·第1餐厅·第1道菜）= ${allCodes.includes('1211') ? '存在 ✔' : '缺失 ✘'}`);
    console.log(pass && problems.length === 0 ? '✔ 校验全部通过' : '✘ 存在问题：\n- ' + problems.join('\n- '));
    if (!pass || problems.length) process.exitCode = 1;
}

build();
