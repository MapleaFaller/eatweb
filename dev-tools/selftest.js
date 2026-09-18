/* ============================================================
   selftest.js —— 开发自检脚本（Node）
   作用：把 js/data.js + js/loader.js 在 vm 沙箱里执行（与浏览器
        脚本加载方式一致），用本地文件模拟 fetch('data/...')，
        验证：
        1) 能正确解析 data/*.xlsx 并重建各食堂楼层门店的正餐菜品；
        2) 菜品内部编号规则正确（第一食堂二楼第1餐厅第1道菜 = 1211）；
        3) 每道菜在 images/ 多级目录中都有对应图片（食堂/楼层/门店/菜名）；
        4) 早餐表 data/breakfast/*.xlsx 能正确挂到门店 breakfastItems 上，
           有 / 无早餐的门店都符合预期，且早餐图片在 images-breakfast/ 中存在。
   用法： node dev-tools/selftest.js
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// 模拟浏览器 fetch：把 data/xxx.xlsx 映射到本地磁盘
const fetchMock = async (url) => {
    const file = path.join(ROOT, String(url).replace(/^data\//, 'data/'));
    const buf = fs.readFileSync(file);
    const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    return { ok: true, status: 200, arrayBuffer: async () => ab };
};

const sandbox = {
    console,
    XLSX: require(path.join(ROOT, 'js', 'lib', 'xlsx.full.min.js')),
    fetch: fetchMock,
    Image: function () { this.onload = this.onerror = null; this.src = ''; },
    location: { protocol: 'http:' }
};
vm.createContext(sandbox);

// 与 index.html 相同的加载顺序（仅数据层）
vm.runInContext(read('js/data.js') + '\n;this.canteenData = canteenData;', sandbox);
vm.runInContext(read('js/loader.js'), sandbox);

(async () => {
    const problems = await vm.runInContext('loadAllData()', sandbox);
    const canteenData = sandbox.canteenData;

    const fails = [];
    const logs = [];

    if (problems.length) fails.push('loadAllData 报告问题：' + problems.join('；'));

    const total = canteenData.reduce((s, c) => s + c.floors.reduce((a, f) => a + f.shops.reduce((b, sh) => b + sh.items.length, 0), 0), 0);
    logs.push(`共载入菜品 ${total} 道`);

    // 校验 1211
    const c1 = canteenData.find(c => c.id === 'canteen1');
    const floor2 = c1.floors.find(f => f.id === 'c1f2');
    const shop1 = floor2.shops.find(s => s.name === '家味小厨');
    const dish1 = shop1.items[0];
    if (dish1.code !== '1211') fails.push(`内部编号应为 1211，实际 ${dish1.code}`);
    if (dish1.name !== '红烧肉') fails.push(`B2 名称应为 红烧肉，实际 ${dish1.name}`);
    if (dish1.price !== 48) fails.push(`价格应为 48，实际 ${dish1.price}`);

    // 收集全部内部编号，并核对 images/ 多级目录（食堂/楼层/门店/菜名）下是否存在对应图片
    const codes = [];
    canteenData.forEach(c => c.floors.forEach(f => f.shops.forEach(sh => sh.items.forEach(it => {
        codes.push(it.code);
        const imgPath = path.join(ROOT, 'images', c.name, f.label, sh.name, `${it.name}.svg`);
        if (!fs.existsSync(imgPath)) {
            fails.push(`缺图片 images/${c.name}/${f.label}/${sh.name}/${it.name}.svg`);
        }
    }))));

    const dup = codes.filter((v, i) => codes.indexOf(v) !== i);
    if (dup.length) fails.push('内部编号重复：' + [...new Set(dup)].join(','));

    // ---------- 早餐数据自检 ----------
    const bfCodes = [];
    const withBf = [];
    const withoutBf = [];
    canteenData.forEach(c => c.floors.forEach(f => f.shops.forEach(sh => {
        const list = sh.breakfastItems || [];
        if (list.length) withBf.push(`${c.name}/${f.label}/${sh.name}`);
        else withoutBf.push(`${c.name}/${f.label}/${sh.name}`);
        list.forEach(it => {
            bfCodes.push(it.code);
            const imgPath = path.join(ROOT, 'images-breakfast', c.name, f.label, sh.name, `${it.name}.svg`);
            if (!fs.existsSync(imgPath)) {
                fails.push(`缺早餐图片 images-breakfast/${c.name}/${f.label}/${sh.name}/${it.name}.svg`);
            }
        });
    })));
    const bfTotal = bfCodes.length;
    logs.push(`共载入早餐 ${bfTotal} 道｜有早餐门店 ${withBf.length} 家 / 无早餐门店 ${withoutBf.length} 家`);
    if (bfTotal === 0) fails.push('早餐数据为空：data/breakfast/*.xlsx 未正确载入');
    if (withBf.length === 0) fails.push('没有任何门店供应早餐，数据异常');
    if (withoutBf.length === 0) fails.push('没有任何「无早餐」门店，无法验证无早餐提示');
    const bfDup = bfCodes.filter((v, i) => bfCodes.indexOf(v) !== i);
    if (bfDup.length) fails.push('早餐内部编号重复：' + [...new Set(bfDup)].join(','));

    // 指定样点：粤式茶点有早餐；川味小馆、甜心工坊无早餐
    const floor1 = c1.floors.find(f => f.id === 'c1f1');
    const teaShop = floor1.shops.find(s => s.name === '粤式茶点');
    const chuanShop = floor1.shops.find(s => s.name === '川味小馆');
    if (!teaShop || (teaShop.breakfastItems || []).length === 0) fails.push('粤式茶点 应有早餐数据');
    if (chuanShop && (chuanShop.breakfastItems || []).length > 0) fails.push('川味小馆 应无早餐数据');
    const dessertShop = canteenData.find(c => c.id === 'canteen2')
        .floors.find(f => f.id === 'c2f3').shops.find(s => s.name === '甜心工坊');
    if (dessertShop && (dessertShop.breakfastItems || []).length > 0) fails.push('甜心工坊 应无早餐数据');
    logs.push(`样点：粤式茶点早餐 ${(teaShop && teaShop.breakfastItems || []).length} 道；川味小馆 ${(chuanShop && chuanShop.breakfastItems || []).length} 道（应为 0）`);

    const meta = shop1; // 含骨架元信息合并
    logs.push(`家味小厨 desc 继承自骨架：${meta.desc ? '是' : '否'} | items=${shop1.items.length}`);
    logs.push(`第一食堂 2F 门店顺序：${floor2.shops.map(s => s.name).join(' / ')}`);

    console.log('----- loader 自检 -----');
    logs.forEach(l => console.log('  ·', l));
    console.log(fails.length ? `✘ ${fails.length} 处失败：\n- ` + fails.join('\n- ') : '✔ 全部通过');
    process.exitCode = fails.length ? 1 : 0;
})();
