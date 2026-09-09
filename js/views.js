/* ============================================================
   views.js —— 内容区视图渲染模块
   作用：根据当前状态渲染右侧内容区的四种视图：
        - renderBulletin      公告板
        - renderCanteenIntro  食堂介绍页
        - renderRandom        随机推荐
        - renderCanteenMenu   门店菜品网格
        - renderAll           统一调度入口（先刷新菜单树，再选视图）
   说明：
        - 菜品数据由 loader.js 从本地 data/*.xlsx 载入 canteenData；
          菜品图片在渲染前先调用 resolveShopImages / resolveDishImage
          从本地 images/ 解析（见 loader.js）。
        - 带 async 的渲染使用“渲染序号”防止快速切换时旧渲染覆盖新视图。
   依赖：data.js、utils.js、state.js、loader.js、menu.js（renderMenuTree）、
        modal.js（openModal）
   ============================================================ */

// 渲染序号：每次 renderAll / 随机刷新递增；异步渲染结束后若序号已过期则放弃写入
let renderSeq = 0;
function beginRender() { return ++renderSeq; }
function isRenderCurrent(seq) { return seq === renderSeq; }

// ============================================================
//  食堂介绍页图片轮播
// ============================================================

/** 轮播定时器句柄（切换视图时需清除，避免对已销毁的 DOM 继续轮播） */
let introSliderTimer = null;

/** 停止轮播（离开介绍页或重新渲染前调用） */
function stopIntroSlider() {
    if (introSliderTimer) {
        clearInterval(introSliderTimer);
        introSliderTimer = null;
    }
}

/** 初始化轮播：上一张/下一张、圆点跳转、自动播放、悬停暂停、触摸滑动 */
function initIntroSlider(sliderEl) {
    const track = sliderEl.querySelector('.slider-track');
    const slides = sliderEl.querySelectorAll('.slide');
    if (!track || slides.length <= 1) return; // 单图不启用轮播控件

    const prevBtn = sliderEl.querySelector('.slider-btn.prev');
    const nextBtn = sliderEl.querySelector('.slider-btn.next');
    const dots = sliderEl.querySelectorAll('.dot');

    let index = 0;

    const go = (i) => {
        index = (i + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, di) => dot.classList.toggle('active', di === index));
    };

    const next = () => go(index + 1);
    const prev = () => go(index - 1);

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);
    dots.forEach((dot, di) => dot.addEventListener('click', () => go(di)));

    // 初始定位到第 1 张（同步轨道位置与圆点状态）
    go(0);

    // 自动播放（每 5 秒切换一张）
    const startAuto = () => {
        stopIntroSlider();
        introSliderTimer = setInterval(next, 5000);
    };
    startAuto();

    // 鼠标悬停暂停 / 移出恢复
    sliderEl.addEventListener('mouseenter', stopIntroSlider);
    sliderEl.addEventListener('mouseleave', startAuto);

    // 移动端触摸滑动
    let startX = null;
    sliderEl.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });
    sliderEl.addEventListener('touchend', (e) => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) {
            if (dx < 0) next(); else prev();
        }
        startX = null;
    }, { passive: true });
}

// ============================================================
//  渲染右侧内容
// ============================================================

/** 渲染公告板（文本框风格） */
function renderBulletin() {
    stopIntroSlider();
    const list = getBulletins();
    const sorted = [...list].sort((a, b) => b.time - a.time);

    let html = `<div class="bulletin-panel"><div class="bulletin-list">`;

    if (sorted.length === 0) {
        html += `
            <div class="bulletin-empty">
                <span class="empty-icon"><i class="fas fa-bullhorn"></i></span>
                <div class="empty-title">暂无公告</div>
                <div class="empty-hint">管理员尚未发布任何公告，敬请期待</div>
            </div>
        `;
    } else {
        sorted.forEach(item => {
            const title = item.title || '未命名公告';
            const content = item.content || '暂无内容';
            html += `
                <div class="bulletin-item">
                    <div class="b-title">
                        <span>${title}</span>
                        <span class="b-tag">公告</span>
                    </div>
                    <div class="b-content">${content}</div>
                    <div class="b-time">📅 ${formatTime(item.time)}</div>
                </div>
            `;
        });
    }

    html += `</div></div>`;
    contentWrapper.innerHTML = html;

    pageTitle.textContent = '📢 公告';
    floorTag.style.display = 'none';
    shopName.style.display = 'none';
    itemCount.textContent = `${sorted.length} 条公告`;
    subDesc.textContent = '餐厅最新动态与优惠信息';
}

/** 渲染食堂介绍页 */
function renderCanteenIntro() {
    stopIntroSlider();
    const canteen = getCanteen(activeMenuId);
    if (!canteen) {
        contentWrapper.innerHTML = `<div class="empty-state"><i class="fas fa-store"></i><p>食堂不存在</p></div>`;
        return;
    }

    const floorCount = canteen.floors.length;
    let shopCount = 0;
    let itemCountTotal = 0;
    canteen.floors.forEach(f => {
        shopCount += f.shops.length;
        f.shops.forEach(s => {
            itemCountTotal += s.items.length;
        });
    });

    // 多图轮播：优先使用 images 数组，缺省回退到单图
    const defaultImg = 'https://picsum.photos/seed/canteen-default/1200/400';
    const images = (canteen.images && canteen.images.length > 0)
        ? canteen.images
        : [canteen.image || defaultImg];

    const slidesHtml = images.map((url, i) => `
            <div class="slide">
                <img src="${url}" alt="${canteen.name} 图片 ${i + 1}" loading="lazy" />
            </div>
        `).join('');

    // 多图时才渲染 左右按钮 + 圆点指示器
    const ctrlHtml = images.length > 1 ? `
            <button type="button" class="slider-btn prev" aria-label="上一张"><i class="fas fa-chevron-left"></i></button>
            <button type="button" class="slider-btn next" aria-label="下一张"><i class="fas fa-chevron-right"></i></button>
            <div class="slider-dots">
                ${images.map((_, i) => `<span class="dot${i === 0 ? ' active' : ''}"></span>`).join('')}
            </div>
        ` : '';

    let html = `
        <div class="canteen-intro">
            <div class="intro-header">
                <div class="intro-slider">
                    <div class="slider-track">
                        ${slidesHtml}
                    </div>
                    ${ctrlHtml}
                </div>
                <div class="intro-info">
                    <div class="intro-name">
                        <i class="fas ${canteen.icon}"></i> ${canteen.name}
                    </div>
                    <div class="intro-desc">${canteen.desc || '汇聚多种美食，满足你的味蕾。'}</div>
                </div>
            </div>

            <div class="intro-stats">
                <div class="stat-item">
                    <div class="stat-number">${floorCount}</div>
                    <div class="stat-label">楼层</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${shopCount}</div>
                    <div class="stat-label">门店</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${itemCountTotal}</div>
                    <div class="stat-label">菜品</div>
                </div>
            </div>

            <div style="font-size:15px;font-weight:600;color:#2d2a24;margin-bottom:12px;">📋 楼层导览</div>
            <div class="intro-floors">
    `;

    const iconMap = ['fa-egg', 'fa-utensils', 'fa-mug-saucer', 'fa-wine-glass-alt'];
    canteen.floors.forEach((floor, idx) => {
        const shopCount2 = floor.shops.length;
        const icon = iconMap[idx % iconMap.length];
        html += `
            <div class="floor-card" data-floor-id="${floor.id}">
                <div class="f-icon"><i class="fas ${icon}"></i></div>
                <div class="f-info">
                    <div class="f-name">${floor.label}</div>
                    <div class="f-count">${shopCount2} 家门店 · ${floor.shops.reduce((s, shop) => s + shop.items.length, 0)} 道菜品</div>
                </div>
                <div class="f-arrow"><i class="fas fa-chevron-right"></i></div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    contentWrapper.innerHTML = html;

    // 初始化图片轮播
    const introSlider = contentWrapper.querySelector('.intro-slider');
    if (introSlider) {
        initIntroSlider(introSlider);
    }

    const floorCards = contentWrapper.querySelectorAll('.floor-card');
    floorCards.forEach(card => {
        card.addEventListener('click', () => {
            const floorId = card.dataset.floorId;
            const canteen2 = getCanteen(activeMenuId);
            if (!canteen2) return;
            const floor = canteen2.floors.find(f => f.id === floorId);
            if (!floor) return;
            expandedCanteenId = activeMenuId;
            expandedFloorId = floorId;
            if (floor.shops.length > 0) {
                activeShopId = floor.shops[0].id;
            } else {
                activeShopId = null;
            }
            renderAll();
        });
    });

    pageTitle.textContent = canteen.name;
    floorTag.style.display = 'none';
    shopName.style.display = 'none';
    itemCount.textContent = `${itemCountTotal} 道菜品`;
    subDesc.textContent = canteen.desc || '汇聚多种美食';
}

/** 渲染随机推荐 */
async function renderRandom(seq) {
    stopIntroSlider();
    if (!lastRandomItem) {
        lastRandomItem = getRandomItem();
        if (lastRandomItem) {
            lastRandomItem._recommend = getRandomRecommend();
        }
    }

    const item = lastRandomItem;

    if (!item) {
        contentWrapper.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-dice"></i>
                <p>暂无菜品数据，请先添加菜品（编辑 data/*.xlsx 后刷新）</p>
            </div>
        `;
        pageTitle.textContent = '🎲 今天吃什么';
        floorTag.style.display = 'none';
        shopName.style.display = 'none';
        itemCount.textContent = '0 道';
        subDesc.textContent = '点击下方按钮随机推荐一道美味';
        return;
    }

    // 先解析本地菜品图片，避免渲染闪烁
    await resolveDishImage(item);
    if (seq && !isRenderCurrent(seq)) return;

    const imgUrl = itemImage(item);
    const recommend = item._recommend || getRandomRecommend();
    const locationText = `${item.canteenName} · ${item.floorLabel} · ${item.shopName}`;

    let html = `
        <div class="random-panel">
            <div class="random-card" id="randomCard">
                <div class="rc-image">
                    <img src="${imgUrl}" alt="${item.name}" loading="lazy" />
                </div>
                <div class="rc-body">
                    <div class="rc-name">${item.name}</div>
                    <div class="rc-price">¥${item.price}</div>
                    <div class="rc-location"><i class="fas fa-location-dot"></i> ${locationText}</div>
                    <div class="rc-desc">${item.desc || '暂无描述'}</div>
                    <div class="rc-hint">💡 ${recommend}</div>
                </div>
            </div>
            <button class="refresh-btn" id="randomRefresh"><i class="fas fa-shuffle"></i> 换一道</button>
        </div>
    `;

    contentWrapper.innerHTML = html;

    const card = document.getElementById('randomCard');
    if (card) {
        card.addEventListener('click', () => {
            openModal(item, itemImage(item));
        });
    }

    const refreshBtn = document.getElementById('randomRefresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            lastRandomItem = getRandomItem();
            if (lastRandomItem) {
                lastRandomItem._recommend = getRandomRecommend();
            }
            renderRandom(beginRender());
        });
    }

    pageTitle.textContent = '🎲 今天吃什么';
    floorTag.style.display = 'none';
    shopName.style.display = 'none';
    itemCount.textContent = '随机推荐';
    subDesc.textContent = `${item.canteenName} · ${item.floorLabel} · ${item.shopName}`;
}

/** 渲染菜品列表（菜品图片为本地 images/ 文件，渲染前先解析） */
async function renderCanteenMenu(seq) {
    stopIntroSlider();
    const canteen = getCanteen(activeMenuId);
    if (!canteen) {
        contentWrapper.innerHTML = `<div class="empty-state"><i class="fas fa-store"></i><p>食堂不存在</p></div>`;
        return;
    }

    let shop = null;
    let floor = null;
    if (activeShopId) {
        for (const f of canteen.floors) {
            const found = f.shops.find(s => s.id === activeShopId);
            if (found) {
                shop = found;
                floor = f;
                break;
            }
        }
    }

    if (!shop && expandedFloorId) {
        const f = canteen.floors.find(fl => fl.id === expandedFloorId);
        if (f && f.shops.length > 0) {
            shop = f.shops[0];
            floor = f;
            activeShopId = shop.id;
        }
    }

    if (!shop && canteen.floors.length > 0) {
        floor = canteen.floors[0];
        if (floor.shops.length > 0) {
            shop = floor.shops[0];
            activeShopId = shop.id;
            if (!expandedFloorId) {
                expandedFloorId = floor.id;
            }
        }
    }

    if (!shop || !floor) {
        renderCanteenIntro();
        return;
    }

    // 预解析本店全部菜品图片（本地文件，速度快；结果缓存后无需重复探测）
    await resolveShopImages(shop);
    if (seq && !isRenderCurrent(seq)) return;

    pageTitle.textContent = canteen.name;
    const floorLabel = floor.label || '';
    const tag = floorLabel.includes('·') ? floorLabel.split('·')[0].trim() : floorLabel;
    floorTag.style.display = 'inline';
    floorTag.textContent = tag || '楼层';
    shopName.style.display = 'inline-flex';
    shopNameText.textContent = shop.name;
    itemCount.textContent = `${shop.items.length} 道菜品`;
    subDesc.textContent = shop.desc || '';

    // 店面图片展示（位于菜单网格上方；无本地店招时回退网络占位图）
    const shopImg = shop.image || `https://picsum.photos/seed/${shop.id}/900/300`;

    let html = `
        <div class="shop-banner">
            <img src="${shopImg}" alt="${shop.name}" loading="lazy" />
            <div class="shop-banner-info">
                <div class="shop-banner-name">${shop.name}</div>
                <div class="shop-banner-desc">${shop.desc || ''}</div>
            </div>
        </div>
        <div class="menu-grid">`;
    shop.items.forEach((item, index) => {
        const imgUrl = itemImage(item);
        html += `
            <div class="menu-card" data-index="${index}">
                <div class="card-image">
                    <img src="${imgUrl}" alt="${item.name}" loading="lazy" />
                </div>
                <div class="card-body">
                    <h3>${item.name}</h3>
                    <span class="price-tag">¥${item.price}</span>
                </div>
            </div>
        `;
    });
    html += `</div>`;

    contentWrapper.innerHTML = html;

    const cards = contentWrapper.querySelectorAll('.menu-card');
    cards.forEach((card, index) => {
        const item = shop.items[index];
        if (item) {
            card.addEventListener('click', () => {
                openModal(item, itemImage(item));
            });
        }
    });

    if (expandedCanteenId !== canteen.id) {
        expandedCanteenId = canteen.id;
        renderMenuTree();
    }
}

// ============================================================
//  统一渲染
// ============================================================
async function renderAll() {
    const seq = beginRender();
    renderMenuTree();

    if (activeMenuId === 'bulletin') {
        renderBulletin();
    } else if (activeMenuId === 'random') {
        await renderRandom(seq);
    } else {
        const canteen = getCanteen(activeMenuId);
        if (!canteen) {
            contentWrapper.innerHTML =
            `<div class="empty-state"><i class="fas fa-store"></i><p>食堂不存在</p></div>`;
            return;
        }

        let hasShop = false;
        if (activeShopId) {
            for (const f of canteen.floors) {
                if (f.shops.some(s => s.id === activeShopId)) {
                    hasShop = true;
                    break;
                }
            }
        }

        if (!hasShop && expandedFloorId) {
            const floor = canteen.floors.find(f => f.id === expandedFloorId);
            if (floor && floor.shops.length > 0) {
                activeShopId = floor.shops[0].id;
                hasShop = true;
            }
        }

        if (hasShop) {
            await renderCanteenMenu(seq);
        } else {
            renderCanteenIntro();
        }
    }
}
