# 更新日志（CHANGELOG）

> 本文件记录 githubver0.1 → githubver0.2 及后续维护期间的更新内容。

## v0.2 · 2026-09-09

### 同步 ver 版本更新

- 本目录与 ver0.2（原 ver0.1）保持完全一致，完整同步 ver 版本的“完成信息图表本地化”更新：
  - 菜品数据 → 本地 `data/First.xlsx`、`Second.xlsx`、`Third.xlsx`；
  - 菜品图片 → 本地 `images/`（图片序号如 `1211`）；
  - 新增 `js/loader.js`、`js/lib/xlsx.full.min.js`、`dev-tools/` 及本地服务器启动脚本。
- 后续更新统一以 ver0.2 目录为准，本目录为可发布的同步副本。
- 版本由 githubver0.1 升级为 githubver0.2（目录名同步更新）。

## v0.2 · 2026-09-09 · 维护更新（图片目录多级化）

### 图片目录与 ver0.2 同步多级化

- 与 ver0.2 同步更新：`images/` 由扁平「图片序号」文件整理为按
  食堂 → 楼层 → 门店 → 菜 四级中文目录归档：
  `images/<食堂名>/<楼层标签>/<门店名>/<菜名>.svg`
  （例：`images/第一食堂/2F · 家常/家味小厨/红烧肉.svg`）。
- 同步更新 `js/loader.js`（按名称目录拼路径取图）、`dev-tools/build.js`、
  `dev-tools/selftest.js` 与 README；原 `images/图片序号说明.txt`
  改为 `images/菜品图片目录说明.txt`。

## v0.2 · 2026-09-09 · 新增早餐模式（与 ver0.2 同步）

### 正餐 / 早餐切换 + 无早餐提示

- 与 ver0.2 同步：页头右上角新增「正餐 / 早餐」切换按钮；早餐菜单来自新增的
  `data/breakfast/*.xlsx`，早餐图片放在新增的 `images-breakfast/`
  （按 食堂 → 楼层 → 门店 → 菜名 多级中文目录，已生成 29 张早餐占位示例图）。
- **「无早餐」规则**：未出现在早餐表中的门店 = 该窗口不供应早餐；早餐模式下
  左侧菜单显示「无早餐」徽标，右侧菜品目录显示「本窗口无早餐」提示。
- 同步更新 `index.html`、`css/components.css`、`css/responsive.css`、
  `js/state.js`、`js/loader.js`、`js/menu.js`、`js/views.js`、`js/utils.js`、
  `js/app.js`、`dev-tools/`（新增 `menu-content-breakfast.js`）与 README。
