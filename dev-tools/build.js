/* ============================================================
   build.js —— dev-tools 生成脚本（Node 运行，无需安装依赖）
   用法：  node dev-tools/build.js
   生成内容（相对项目根目录）：
      1) 正餐表 data/First.xlsx  Second.xlsx  Third.xlsx
         早餐表 data/breakfast/First.xlsx  Second.xlsx  Third.xlsx
         每个食堂一个 xlsx；第一个 sheet=一楼、第二个 sheet=二楼……
         每个 sheet：第 1 行表头 [餐厅, 名称, 价格, 介绍]，
         第 2 行起一行一道菜（同一餐厅的菜连续排列，A 列写餐厅名）。
         早餐表格式与正餐表完全相同；某门店不出现在早餐表中
         = 该窗口「无早餐」（页面在早餐模式下会明确提示）。
      2) 占位示例图（多级中文目录归档）：
         正餐 images/<食堂名>/<楼层标签>/<门店名>/<菜名>.svg
         早餐 images-breakfast/<食堂名>/<楼层标签>/<门店名>/<菜名>.svg
         例：images/第一食堂/2F · 家常/家味小厨/红烧肉.svg
             images-breakfast/第一食堂/2F · 家常/家味小厨/现磨豆浆.svg
   依赖：../js/lib/xlsx.full.min.js（SheetJS，本地已放好）
   注意：本脚本会覆盖 data/**、images/**、images-breakfast/** 中由种子
        数据生成的表格与占位图（真实照片 png/jpg 等不受影响）。
   ============================================================ */

const path = require('path');
const fs = require('fs');
const XLSX = require(path.join(__dirname, '..', 'js', 'lib', 'xlsx.full.min.js'));

const ROOT = path.join(__dirname, '..');

// 食堂文件名 → 图片目录第 1 级“食堂名”
// （须与 js/data.js 中 canteenData[].name 保持一致：loader 在浏览器端
//  用 canteen.name 拼接同样的目录名，不一致会导致找不到图片）
const CANTEEN_FOLDER = {
    'First.xlsx': '第一食堂',
    'Second.xlsx': '第二食堂',
    'Third.xlsx': '第三食堂'
};

const HEADER = ['餐厅', '名称', '价格', '介绍'];

// 两套餐次：正餐（data/ + images/）与早餐（data/breakfast/ + images-breakfast/）
const MEAL_SETS = [
    {
        label: '正餐',
        content: require('./menu-content.js'),
        dataDir: path.join(ROOT, 'data'),
        imgDir: path.join(ROOT, 'images'),
        badge: (code) => `示例图 #${code}`,
        sample: ['第一食堂', '2F · 家常', '家味小厨', '红烧肉.svg']
    },
    {
        label: '早餐',
        content: require('./menu-content-breakfast.js'),
        dataDir: path.join(ROOT, 'data', 'breakfast'),
        imgDir: path.join(ROOT, 'images-breakfast'),
        badge: (code) => `早餐示例图 #${code}`,
        sample: ['第一食堂', '2F · 家常', '家味小厨', '现磨豆浆.svg']
    }
];

/* 楼层号：从 sheet 名/楼层标签中取第一个数字（与浏览器端 loader 同规则） */
function floorNumFromLabel(label) {
    const m = String(label).match(/\d+/);
    return m ? parseInt(m[0], 10) : 0;
}

/* 菜品内部编号 = 食堂号 + 楼层号 + 餐厅号 + 菜序号（仅作占位图角标等标识用） */
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

function makeSvg(code, canteenNum, meta, badgeText) {
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
    <text x="89" y="34" font-family="Segoe UI, Microsoft YaHei, sans-serif" font-size="15" font-weight="700" fill="#8a6d3b" text-anchor="middle">${escXml(badgeText || `示例图 #${code}`)}</text>
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

/** 递归收集某目录下所有 .svg 相对路径（供图片完整性校验） */
function listSvgFiles(dir, base) {
    const out = [];
    fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
        const abs = path.join(dir, e.name);
        const rel = base ? path.join(base, e.name) : e.name;
        if (e.isDirectory()) out.push(...listSvgFiles(abs, rel));
        else if (/\.svg$/i.test(e.name)) out.push(rel);
    });
    return out;
}

/**
 * 生成一套餐次数据（xlsx + 占位图）并做完整性校验。
 * @param {object} cfg MEAL_SETS 中的一项
 * @returns {string[]} 问题列表（空数组 = 全部通过）
 */
function buildSet(cfg) {
    const problems = [];
    fs.mkdirSync(cfg.dataDir, { recursive: true });
    fs.mkdirSync(cfg.imgDir, { recursive: true });

    const allCodes = [];      // 内部编号查重
    const written = [];       // 已写占位图（相对 imgDir 路径，供末尾校验）
    let dishTotal = 0;

    cfg.content.forEach((canteen, cIdx) => {
        const canteenNum = cIdx + 1;
        const wb = XLSX.utils.book_new();
        const floorSheets = []; // {floor, ws}

        canteen.floors.forEach((floor) => {
            const ws = sheetFromFloor(floor);
            const sheetName = floor.sheet && floor.sheet.length <= 31 ? floor.sheet : `F${floorNumFromLabel(floor.sheet) || canteen.floors.indexOf(floor) + 1}`;
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
            floorSheets.push({ floor, ws });
        });

        const outBuf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
        fs.writeFileSync(path.join(cfg.dataDir, canteen.file), outBuf);
        console.log(`✔ [${cfg.label}] 生成 ${canteen.file}（${floorSheets.length} 个 sheet）`);

        // 生成占位图（多级目录）+ 记录内部编号与已写文件
        floorSheets.forEach(({ floor }) => {
            const floorNum = floorNumFromLabel(floor.sheet);
            const canteenFolder = CANTEEN_FOLDER[canteen.file] || `第${canteenNum}食堂`;
            floor.shops.forEach((shop, shopIdx) => {
                shop.items.forEach((it, dishIdx) => {
                    const code = dishCode(canteenNum, floorNum, shopIdx + 1, dishIdx + 1);
                    if (allCodes.includes(code)) {
                        problems.push(`[${cfg.label}] 内部编号重复：${code}（${canteen.file} ${floor.sheet} / ${shop.name} / ${it.name}）`);
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
                    const outDir = path.join(cfg.imgDir, canteenFolder, floor.sheet, shop.name);
                    fs.mkdirSync(outDir, { recursive: true });
                    fs.writeFileSync(path.join(outDir, `${it.name}.svg`), makeSvg(code, canteenNum, meta, cfg.badge(code)));
                    written.push(path.join(canteenFolder, floor.sheet, shop.name, `${it.name}.svg`));
                });
            });
        });
    });

    // 校验表格：重新读取 xlsx，确认 sheet 数 / B2 / 菜品行数
    let pass = true;
    cfg.content.forEach((canteen) => {
        const wb = XLSX.read(fs.readFileSync(path.join(cfg.dataDir, canteen.file)), { type: 'buffer' });
        if (wb.SheetNames.length !== canteen.floors.length) {
            problems.push(`[${cfg.label}] ${canteen.file} sheet 数量 ${wb.SheetNames.length} ≠ ${canteen.floors.length}`);
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
                problems.push(`[${cfg.label}] ${canteen.file} ${name} B2 期望「${expectFirst}」实际「${b2}」`);
                pass = false;
            }
            let rowCount = 0;
            for (let r = 1; r < rows.length; r++) {
                if (rows[r] && String(rows[r][1] || '').trim()) rowCount++;
            }
            const expectCount = floor.shops.reduce((s, sh) => s + sh.items.length, 0);
            if (rowCount !== expectCount) {
                problems.push(`[${cfg.label}] ${canteen.file} ${name} 菜品行数 ${rowCount} ≠ ${expectCount}`);
                pass = false;
            }
        });
    });

    // 校验图片：递归对比实际 svg 与本次生成清单
    const actualSvgs = listSvgFiles(cfg.imgDir, '');
    const missing = written.filter((p) => !actualSvgs.includes(p));
    const extra = actualSvgs.filter((p) => !written.includes(p));

    if (missing.length) { problems.push(`[${cfg.label}] 缺图片：${missing.join(',')}`); pass = false; }
    if (extra.length) { problems.push(`[${cfg.label}] 多余 svg 图片：${extra.join(',')}`); pass = false; }

    const sampleSvg = path.join(cfg.imgDir, ...cfg.sample);
    const sampleOk = fs.existsSync(sampleSvg);
    if (!sampleOk) { problems.push(`[${cfg.label}] 缺少示例图片 ${cfg.sample.join('/')}`); pass = false; }

    console.log(`   [${cfg.label}] 菜品 ${dishTotal} 道；svg 占位图 ${written.length} 张；校验 ${pass && !problems.length ? '通过 ✔' : '未通过 ✘'}`);
    console.log(`   [${cfg.label}] 示例：${cfg.sample.join('/')} → ${sampleOk ? '存在 ✔' : '缺失 ✘'}`);
    return problems;
}

function build() {
    const problems = [];
    MEAL_SETS.forEach((cfg) => { problems.push(...buildSet(cfg)); });

    console.log(problems.length === 0
        ? '✔ 全部校验通过（正餐 + 早餐）'
        : '✘ 存在问题：\n- ' + problems.join('\n- '));
    if (problems.length) process.exitCode = 1;
}

build();
