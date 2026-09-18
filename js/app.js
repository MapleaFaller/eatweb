/* ============================================================
   app.js —— 应用入口模块
   作用：页面启动入口：
        - 异步读取本地数据源（正餐 data/*.xlsx + 早餐 data/breakfast/*.xlsx，
          图片目录 images/ 与 images-breakfast/）
        - 顶部「正餐 / 早餐」切换按钮：切换餐次并重新渲染菜单
        - 读取完成后初始化状态并执行首次渲染（renderAll）
        - 顶部数据源状态提示（成功 / 失败原因）
        - 全局图片加载失败的兜底处理（显示占位图）
   依赖：data.js、utils.js、state.js、loader.js、menu.js、
        views.js、modal.js、index-panel.js
   注意：本文件必须最后加载（其他模块已就绪后执行 init）。
   ============================================================ */

// ============================================================
//  数据源状态提示条（位于右侧页头下方 #dataNotice）
// ============================================================
const dataNoticeEl = document.getElementById('dataNotice');
let dataNoticeTimer = null;

/**
 * 显示/更新数据源状态提示
 * @param {string} msg   提示文字
 * @param {string} kind  ok | warn | error
 * @param {boolean} autoHide 是否几秒后自动隐藏
 */
function setDataNotice(msg, kind, autoHide) {
    if (!dataNoticeEl) return;
    if (dataNoticeTimer) {
        clearTimeout(dataNoticeTimer);
        dataNoticeTimer = null;
    }
    dataNoticeEl.className = `data-notice ${kind}`;
    dataNoticeEl.innerHTML = `<i class="fas ${kind === 'ok' ? 'fa-circle-check' : kind === 'error' ? 'fa-circle-xmark' : 'fa-triangle-exclamation'}"></i> ${msg}`;
    dataNoticeEl.hidden = false;
    if (autoHide) {
        dataNoticeTimer = setTimeout(() => {
            dataNoticeEl.hidden = true;
        }, 6000);
    }
}

function hideDataNotice() {
    if (dataNoticeEl) dataNoticeEl.hidden = true;
}

// ============================================================
//  初始化（异步：先读本地数据，再渲染）
// ============================================================
(async function init() {
    // 读取数据前先给出加载占位
    contentWrapper.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>正在读取本地数据 data/*.xlsx（含早餐 data/breakfast/）与 images/ …</p>
        </div>
    `;

    const problems = [];
    try {
        const loaded = await loadAllData();
        problems.push(...loaded);
    } catch (err) {
        problems.push(`数据加载异常：${err && err.message ? err.message : err}`);
    }

    // 重置为初始视图（公告）
    activeMenuId = 'bulletin';
    expandedCanteenId = null;
    expandedFloorId = null;
    activeShopId = null;
    renderAll();

    if (problems.length > 0) {
        setDataNotice(`⚠️ ${problems.join('；')}`, 'warn');
    } else {
        const n = countDishes();
        const nb = typeof countBreakfastDishes === 'function' ? countBreakfastDishes() : 0;
        setDataNotice(`✅ 数据源就绪：菜品取自本地 data/*.xlsx 与 data/breakfast/*.xlsx（正餐 ${n} 道 / 早餐 ${nb} 道），图片取自 images/ 与 images-breakfast/（按 食堂→楼层→门店→菜名 分目录存放）`, 'ok', true);
    }
})();

// ============================================================
//  图片加载失败备用（如食堂/门店宣传图网络图失败时显示占位）
// ============================================================
document.addEventListener('error', (e) => {
    const img = e.target;
    if (img.tagName === 'IMG') {
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f0ebe5" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="sans-serif" font-size="20" fill="%23b8ada2" text-anchor="middle" dominant-baseline="central"%3E🍽%E3%80%80暂无图片%3C/text%3E%3C/svg%3E';
    }
}, true);

// ============================================================
//  餐次切换（正餐 / 早餐）
//  切换后重置随机推荐并整体重渲染：菜单树、数量徽标、菜品目录
//  —— 早餐模式下没有早餐的窗口会在菜品目录显示「无早餐」。
// ============================================================
applyMealModeUI();

document.querySelectorAll('.meal-switch-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        if (!mode || mode === mealMode) return;
        mealMode = mode;
        lastRandomItem = null;   // 随机推荐可能属于另一餐次，需重新抽取
        applyMealModeUI();
        renderAll();
    });
});
