/* ============================================================
   menu.js —— 左侧菜单树模块
   作用：根据数据与当前状态，构建并渲染左侧边栏的导航菜单：
        - 功能项（公告、今天吃什么）
        - 食堂项（可展开显示楼层 → 门店三级结构）
   依赖：data.js（canteenData）、state.js（menuTreeEl 及状态变量）
   ============================================================ */

// ============================================================
//  构建菜单树数据
// ============================================================
function buildMenuTree() {
    const items = [];
    // 功能项
    items.push({
        id: 'bulletin',
        type: 'function',
        label: '📢 公告',
        icon: 'fa-bullhorn',
        isFunction: true
    });
    items.push({
        id: 'random',
        type: 'function',
        label: '🎲 今天吃什么',
        icon: 'fa-dice',
        isFunction: true
    });
    items.push({ id: 'divider', type: 'divider' });
    // 食堂
    canteenData.forEach(c => {
        items.push({
            id: c.id,
            type: 'canteen',
            label: c.name,
            icon: c.icon,
            canteen: c,
            isFunction: false
        });
    });
    return items;
}

// ============================================================
//  渲染左侧菜单
// ============================================================
function renderMenuTree() {
    const tree = buildMenuTree();
    menuTreeEl.innerHTML = '';

    tree.forEach((item) => {
        if (item.type === 'divider') {
            const hr = document.createElement('hr');
            hr.className = 'menu-divider';
            menuTreeEl.appendChild(hr);
            return;
        }

        if (item.isFunction) {
            const btn = document.createElement('button');
            btn.className = `menu-item function-item ${activeMenuId === item.id ? 'active' : ''}`;
            btn.dataset.id = item.id;
            btn.innerHTML = `
                <i class="fas ${item.icon}"></i>
                <span class="label">${item.label}</span>
            `;
            btn.addEventListener('click', () => {
                if (activeMenuId === item.id) return;
                activeMenuId = item.id;
                expandedCanteenId = null;
                expandedFloorId = null;
                activeShopId = null;
                renderAll();
            });
            menuTreeEl.appendChild(btn);
            return;
        }

        if (item.type === 'canteen') {
            const c = item.canteen;
            const isExpanded = (expandedCanteenId === c.id);
            const isActive = (activeMenuId === c.id);

            const btn = document.createElement('button');
            btn.className = `menu-item ${isActive ? 'active' : ''}`;
            btn.dataset.id = c.id;
            const totalItems = c.floors.reduce((sum, f) => sum + f.shops.reduce((s, shop) => s + shop.items
                .length, 0), 0);
            btn.innerHTML = `
                <i class="fas ${c.icon}"></i>
                <span class="label">${c.name}</span>
                <span class="badge">${totalItems}</span>
                <span class="arrow ${isExpanded ? 'open' : ''}"><i class="fas fa-chevron-right"></i></span>
            `;

            btn.addEventListener('click', (e) => {
                e.stopPropagation();

                if (expandedCanteenId === c.id) {
                    expandedCanteenId = null;
                    expandedFloorId = null;
                    activeShopId = null;
                } else {
                    expandedCanteenId = c.id;
                    expandedFloorId = null;
                    activeShopId = null;
                }
                activeMenuId = c.id;
                renderAll();
            });

            menuTreeEl.appendChild(btn);

            if (isExpanded) {
                c.floors.forEach((floor) => {
                    const isFloorExpanded = (expandedFloorId === floor.id);
                    const floorBtn = document.createElement('button');
                    floorBtn.className = `menu-item level-1`;
                    const floorItems = floor.shops.reduce((sum, s) => sum + s.items.length, 0);
                    const iconMap = ['fa-egg', 'fa-utensils', 'fa-mug-saucer', 'fa-wine-glass-alt'];
                    const idx = c.floors.indexOf(floor) % iconMap.length;
                    floorBtn.innerHTML = `
                        <i class="fas ${iconMap[idx]}"></i>
                        <span class="label">${floor.label}</span>
                        <span class="badge">${floorItems}</span>
                        <span class="arrow ${isFloorExpanded ? 'open' : ''}"><i class="fas fa-chevron-right"></i></span>
                    `;

                    floorBtn.addEventListener('click', (e) => {
                        e.stopPropagation();

                        if (expandedFloorId === floor.id) {
                            expandedFloorId = null;
                            if (activeShopId) {
                                const inThisFloor = floor.shops.some(s => s.id ===
                                activeShopId);
                                if (inThisFloor) {
                                    activeShopId = null;
                                }
                            }
                        } else {
                            expandedFloorId = floor.id;
                            if (floor.shops.length > 0) {
                                activeShopId = floor.shops[0].id;
                            }
                        }
                        activeMenuId = c.id;
                        renderAll();
                    });

                    menuTreeEl.appendChild(floorBtn);

                    if (isFloorExpanded) {
                        floor.shops.forEach((shop, idx) => {
                            const shopBtn = document.createElement('button');
                            shopBtn.className =
                                `menu-item level-2 ${activeShopId === shop.id ? 'active' : ''}`;
                            const icon = shop.icon || getShopIcon(idx);
                            shopBtn.innerHTML = `
                                <i class="fas ${icon}"></i>
                                <span class="label">${shop.name}</span>
                                <span class="badge">${shop.items.length}</span>
                            `;
                            shopBtn.addEventListener('click', (e) => {
                                e.stopPropagation();
                                activeShopId = shop.id;
                                activeMenuId = c.id;
                                if (expandedFloorId !== floor.id) {
                                    expandedFloorId = floor.id;
                                }
                                renderAll();
                            });
                            menuTreeEl.appendChild(shopBtn);
                        });
                    }
                });
            }
        }
    });
}
