/* ============================================================
   modal.js —— 模态框模块
   作用：控制菜品详情模态框的显示与关闭：
        - openModal / closeModal
        - 事件绑定（关闭按钮 / 点击遮罩 / Esc 键）
   依赖：state.js（modalOverlay 等 DOM 引用）
   ============================================================ */

// ============================================================
//  模态框
// ============================================================

/** 打开模态框并填充菜品信息 */
function openModal(item, imgUrl) {
    modalImg.src = imgUrl;
    modalImg.alt = item.name;
    modalTitle.textContent = item.name;
    modalPrice.textContent = `¥${item.price.toFixed(2)}`;
    modalDesc.textContent = item.desc || '暂无描述';
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

/** 关闭模态框 */
function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

// ============================================================
//  事件绑定（模块加载时执行）
// ============================================================

// 点击关闭按钮
modalClose.addEventListener('click', closeModal);

// 点击遮罩层（非卡片区域）关闭
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// 按 Esc 键关闭
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});
