/* ============================================================
   index-panel.js —— 手机端索引抽屉模块
   作用：手机端（≤768px）右上角「索引」按钮的展开/收起控制：
        - 点击按钮展开/收起顶部下拉抽屉（#menuTree）
        - 点击遮罩 / 按 Esc 键收起
        - 在抽屉内选中「功能项」或「门店项」后自动收起
        - 窗口从手机布局切换到桌面布局时自动收起
   桌面端不受影响：按钮与遮罩在 CSS 中默认隐藏，本模块仅在
   手机布局（matchMedia ≤768px）下产生交互效果。
   依赖：state.js（indexToggle / indexMask / menuTreeEl）
   ============================================================ */

// 手机布局判断（与 responsive.css 的断点一致）
const MOBILE_QUERY = window.matchMedia('(max-width: 768px)');

function isMobile() {
    return MOBILE_QUERY.matches;
}

/** 展开索引抽屉 */
function openIndex() {
    menuTreeEl.classList.add('open');
    indexMask.classList.add('open');
    indexToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('index-open'); // 锁定页面滚动
}

/** 收起索引抽屉 */
function closeIndex() {
    menuTreeEl.classList.remove('open');
    indexMask.classList.remove('open');
    indexToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('index-open'); // 恢复页面滚动
}

/** 切换索引抽屉 */
function toggleIndex() {
    if (menuTreeEl.classList.contains('open')) {
        closeIndex();
    } else {
        openIndex();
    }
}

// ============================================================
//  事件绑定（模块加载时执行）
// ============================================================

// 右上角按钮：展开/收起
indexToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!isMobile()) return;
    toggleIndex();
});

// 点击遮罩：收起
indexMask.addEventListener('click', () => {
    closeIndex();
});

// 按 Esc：收起
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeIndex();
});

// 事件委托（挂在持久的容器 #menuTree 上，不因重渲染失效）：
//   - 功能项（公告 / 今天吃什么）与门店项（level-2）点击后自动收起抽屉；
//   - 食堂 / 楼层项保持展开，便于在抽屉内继续下钻选择。
menuTreeEl.addEventListener('click', (e) => {
    const item = e.target.closest('.menu-item');
    if (!item) return;
    if (item.classList.contains('function-item') || item.classList.contains('level-2')) {
        closeIndex();
    }
});

// 布局切换兜底：窗口从手机布局切回桌面布局时自动收起
if (MOBILE_QUERY.addEventListener) {
    MOBILE_QUERY.addEventListener('change', (e) => {
        if (!e.matches) closeIndex();
    });
} else if (MOBILE_QUERY.addListener) {
    MOBILE_QUERY.addListener((e) => {
        if (!e.matches) closeIndex();
    });
}
