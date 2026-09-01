/* ============================================================
   app.js —— 应用入口模块
   作用：页面启动入口：
        - 初始化全局状态并执行首次渲染（init）
        - 全局图片加载失败的兜底处理（显示占位图）
   依赖：data.js、utils.js、state.js、menu.js、views.js、modal.js
   注意：本文件必须最后加载（其他模块已就绪后执行 init）。
   ============================================================ */

// ============================================================
//  初始化
// ============================================================
(function init() {
    // 公告数据直接来自 data.js 的 DEFAULT_BULLETINS，无需额外初始化

    activeMenuId = 'bulletin';
    expandedCanteenId = null;
    expandedFloorId = null;
    activeShopId = null;
    renderAll();
})();

// ============================================================
//  图片加载失败备用
// ============================================================
document.addEventListener('error', (e) => {
    const img = e.target;
    if (img.tagName === 'IMG') {
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f0ebe5" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="sans-serif" font-size="20" fill="%23b8ada2" text-anchor="middle" dominant-baseline="central"%3E🍽%E3%80%80暂无图片%3C/text%3E%3C/svg%3E';
    }
}, true);
