/* ============================================================
   selftest.js —— 开发自检脚本（Node）
   作用：把 js/data.js + js/loader.js 在 vm 沙箱里执行（与浏览器
        脚本加载方式一致），用本地文件模拟 fetch('data/...')，
        验证：
        1) 能正确解析 data/*.xlsx 并重建各食堂楼层门店的菜品；
        2) 图片序号规则正确（第一食堂二楼第1餐厅第1道菜 = 1211）；
        3) 每个菜品的序号在 images/ 中都有对应图片文件。
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
    if (dish1.code !== '1211') fails.push(`图片序号应为 1211，实际 ${dish1.code}`);
    if (dish1.name !== '红烧肉') fails.push(`B2 名称应为 红烧肉，实际 ${dish1.name}`);
    if (dish1.price !== 48) fails.push(`价格应为 48，实际 ${dish1.price}`);

    // 收集全部序号并核对 images/ 下是否存在对应文件
    const codes = [];
    canteenData.forEach(c => c.floors.forEach(f => f.shops.forEach(sh => sh.items.forEach(it => {
        codes.push(it.code);
        if (!fs.existsSync(path.join(ROOT, 'images', `${it.code}.svg`))) {
            fails.push(`缺图片 images/${it.code}.svg（${it.name}）`);
        }
    }))));

    const dup = codes.filter((v, i) => codes.indexOf(v) !== i);
    if (dup.length) fails.push('图片序号重复：' + [...new Set(dup)].join(','));

    const meta = shop1; // 含骨架元信息合并
    logs.push(`家味小厨 desc 继承自骨架：${meta.desc ? '是' : '否'} | items=${shop1.items.length}`);
    logs.push(`第一食堂 2F 门店顺序：${floor2.shops.map(s => s.name).join(' / ')}`);

    console.log('----- loader 自检 -----');
    logs.forEach(l => console.log('  ·', l));
    console.log(fails.length ? `✘ ${fails.length} 处失败：\n- ` + fails.join('\n- ') : '✔ 全部通过');
    process.exitCode = fails.length ? 1 : 0;
})();
