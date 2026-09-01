/* ============================================================
   state.js —— 全局状态与 DOM 引用模块
   作用：集中管理页面共享的「运行状态」与「DOM 元素引用」，
        供 menu.js / views.js / modal.js 等模块读写。
   注意：本文件依赖 DOM 已就绪，因此必须放在 <body> 末尾、
        其他业务脚本之前加载。
   ============================================================ */

// ============================================================
//  全局状态
// ============================================================
let activeMenuId = 'bulletin';      // 当前激活的菜单项 id（bulletin / random / 食堂id）
let expandedCanteenId = null;       // 当前展开的食堂 id
let expandedFloorId = null;         // 当前展开的楼层 id
let activeShopId = null;            // 当前选中的门店 id
let lastRandomItem = null;          // 上一次随机推荐的菜品（避免连续重复）

// ============================================================
//  DOM 引用
// ============================================================
const menuTreeEl = document.getElementById('menuTree');
const contentWrapper = document.getElementById('contentWrapper');
const pageTitle = document.getElementById('pageTitle');
const floorTag = document.getElementById('floorTag');
const shopName = document.getElementById('shopName');
const shopNameText = document.getElementById('shopNameText');
const itemCount = document.getElementById('itemCount');
const subDesc = document.getElementById('subDesc');

const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');

// 手机端索引抽屉（右上角按钮 + 遮罩层）
const indexToggle = document.getElementById('indexToggle');
const indexMask = document.getElementById('indexMask');
