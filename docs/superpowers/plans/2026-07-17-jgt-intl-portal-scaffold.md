# jgt-intl-portal Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从 `account-portal` 整仓拷贝再裁剪，在 `international/jgt-intl-portal` 得到纯 Web 脚手架：保留 `/elogin`、预留对接 `bus-jgt-intl`（端口 8090）。

**Architecture:** 复制源码后删除业务页与 Electron；精简路由到 elogin + 占位首页；登录 API 经 `src/api/intl/` 适配层；`VUE_APP_API` + `devServer.proxy` 指向本地 8090。

**Tech Stack:** Vue 2.6 + Vue Router 3 + Vuex 3 + Element UI 2 + d2-admin 骨架 + Vue CLI 4（Web only）

**Spec:** `docs/superpowers/specs/2026-07-17-jgt-intl-portal-design.md`

## Global Constraints

- 目标路径：`/Users/jiangzhongbing/Documents/international/jgt-intl-portal`（与 `bus-jgt-intl` 平级）
- 不修改 `bus-jgt-intl` 仓库
- 纯 Web，无 Electron 主路径
- 登录主入口仅 `/elogin`
- API 基址变量：`VUE_APP_API`（默认 `http://localhost:8090`）
- 本期不强制真实登录联调；适配层与 proxy 必须到位

## File Map

| Path | Responsibility |
| --- | --- |
| `package.json` | 项目名、去 Electron scripts/deps |
| `vue.config.js` | 去 electron 插件；proxy → 8090 |
| `.env` / `.env.development` | 标题、API 基址 |
| `src/api/intl/login.js` | 登录相关可替换适配（re-export 或占位） |
| `src/api/intl/index.js` | intl API 入口 |
| `src/router/routes.js` | 仅 elogin + home + 系统必要路由 |
| `src/views/home/index.vue` | 登录后占位首页 |
| `src/views/system/elogin/**` | 保留登录 UI；改 import 走 intl |
| `README.md` | 启动与对接说明 |

---

### Task 1: 拷贝源码并建立工作分支

**Files:**
- Create: 除已有 `docs/`、`.gitignore` 外的工程文件（从 account-portal 同步）

**Interfaces:**
- Consumes: `/Users/jiangzhongbing/Documents/MyWorker/account-portal`
- Produces: `jgt-intl-portal` 工作树含完整源码副本

- [ ] **Step 1: 创建功能分支**

```bash
cd /Users/jiangzhongbing/Documents/international/jgt-intl-portal
git checkout -b feat/scaffold-from-account-portal
```

- [ ] **Step 2: rsync 拷贝（排除 node_modules/.git/dist）**

```bash
rsync -a \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'dist' \
  --exclude '.idea' \
  --exclude 'docs' \
  /Users/jiangzhongbing/Documents/MyWorker/account-portal/ \
  /Users/jiangzhongbing/Documents/international/jgt-intl-portal/
```

注意：保留已有 `docs/superpowers/**` 与根 `.gitignore`（rsync 排除了 docs；若 `.gitignore` 被覆盖，合并回 `node_modules/` `dist/` `.DS_Store`）。

- [ ] **Step 3: 确认关键文件存在**

```bash
test -f package.json && test -f vue.config.js && test -d src/views/system/elogin && echo OK
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: copy account-portal sources as scaffold base

EOF
)"
```

---

### Task 2: 删除业务页、Electron 与无关目录

**Files:**
- Delete: `src/views/business/`、`jgt-ui-demo/`、`src/main/`（Electron main）、`src/preload/`、`src/router/modules/*`（业务）、业务组件等
- Modify: 见步骤清单

**Interfaces:**
- Consumes: Task 1 工作树
- Produces: 无业务页、无 Electron 主进程目录的树

- [ ] **Step 1: 删除业务视图与 demo**

```bash
rm -rf src/views/business jgt-ui-demo
rm -rf src/router/modules
```

- [ ] **Step 2: 删除 Electron 主进程与预加载**

```bash
rm -rf src/main src/preload
rm -f afterPack.js installer.nsh jgt_code.pfx scanner.bat build.bat
```

- [ ] **Step 3: 删除非骨架系统页与业务组件**

```bash
rm -rf \
  src/views/system/login \
  src/views/system/client-download \
  src/views/system/account-counter-online \
  src/views/system/helpSupportCenter \
  src/views/system/filePreview \
  src/views/system/index \
  src/components/purchase-fee-detail \
  src/components/redeem-fee-detail \
  src/components/transfer-fee-detail \
  src/components/jy-handle-devTools \
  src/components/jy-handle-window \
  src/components/jy-update
```

保留：`elogin`、`error`、`loading`、`log`、`function`

- [ ] **Step 4: 精简 API 业务目录**

保留 `src/api/checkapi.js` 与 axios 用法；删除 `src/api/bussiness` 下除登录仍临时需要的模块前，先在 Task 4 用 `api/intl` 承接。本步可先整目录移走备份：

```bash
rm -rf src/api/bussiness
```

（登录 import 将在 Task 4 改为 `@/api/intl`；若中间编译失败属预期，下一 Task 修复。）

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: remove business pages and electron main process

EOF
)"
```

---

### Task 3: 精简 package.json 与 vue.config.js（纯 Web + proxy）

**Files:**
- Modify: `package.json`、`vue.config.js`、`.env`、`.env.development`

**Interfaces:**
- Consumes: 无
- Produces: `name=jgt-intl-portal`；`serve`/`build`/`lint`；proxy `/` 或网关前缀 → `http://localhost:8090`

- [ ] **Step 1: 改 package.json**

将 `"name"` 改为 `"jgt-intl-portal"`。  
`scripts` 仅保留（可微调）：

```json
{
  "serve": "vue-cli-service serve --open",
  "build": "vue-cli-service build --mode nomock",
  "lint": "eslint --ext .js,.vue ./src",
  "dev": "npm run serve",
  "start": "npm run serve"
}
```

从 `dependencies` / `devDependencies` 删除：`electron`、`electron-*`、`vue-cli-plugin-electron-builder`、`sudo-prompt` 等桌面专用包。删除 `"main": "background.js"` 若存在。

- [ ] **Step 2: 改 vue.config.js**

- 删除 `pluginOptions.electronBuilder` 整块及 electron 相关 require
- `devServer.proxy` 改为至少：

```js
proxy: {
  '/api': {
    target: process.env.VUE_APP_API || 'http://localhost:8090',
    changeOrigin: true
  },
  '/labrador-gateway': {
    target: process.env.VUE_APP_API || 'http://localhost:8090',
    changeOrigin: true
  }
}
```

保留项目能启动所需的 alias、scss、svg 等配置；去掉仅 DEMO/Electron 的分支若导致语法错误则一并清理。

- [ ] **Step 3: 改环境变量**

`.env` / `.env.development` 关键设置：

```
VUE_APP_TITLE=国际业务门户
VUE_APP_PRODUCTNAME=国际业务门户
VUE_APP_API=http://localhost:8090
VUE_APP_LINK_PATH=http://localhost:8090
VUE_APP_WEB_URL=http://localhost:8080/#/elogin
```

- [ ] **Step 4: Commit**

```bash
git add package.json vue.config.js .env .env.development
git commit -m "$(cat <<'EOF'
chore: web-only package and proxy to bus-jgt-intl

EOF
)"
```

---

### Task 4: 路由、占位首页、intl API 适配与登录接线

**Files:**
- Create: `src/views/home/index.vue`、`src/api/intl/login.js`、`src/api/intl/index.js`
- Modify: `src/router/routes.js`、`src/router/index.js`（若有业务引用）、`src/menu/**`、`src/views/system/elogin/**`（API import）
- Modify: `src/main.js` / `App.vue`（去掉 electron 专用初始化若会炸）

**Interfaces:**
- Consumes: `@/plugin/axios` 的 `request`
- Produces:
  - `src/api/intl/login.js` 导出：`userCheck`、`userLogin`、`userTrialLogin`、`addAuthIp`、`userTokenInfo`、`passwordReset`、`deferredLogin`、`sendAuthCode`、`validateAuthCode`、`bindClientList`、`bindClient`（签名与原 LoginForm 用法一致；实现可为 stub 返回 Promise.reject 或占位 request 到 `/api/intl/...`）
  - 路由：`/` → `/elogin`；登录成功目标 `index` → `views/home/index.vue`

- [ ] **Step 1: 写占位首页**

创建 `src/views/home/index.vue`：

```vue
<template>
  <d2-container>
    <h2>国际业务门户脚手架</h2>
    <p>登录成功。后续在此对接 bus-jgt-intl 业务页面。</p>
  </d2-container>
</template>
<script>
export default { name: 'home' }
</script>
```

- [ ] **Step 2: 写 intl login 适配**

`src/api/intl/login.js`：用 `request` 调用占位路径（如 `/api/intl/auth/login`），并导出 LoginForm/dialogs 需要的全部符号。  
`src/api/intl/index.js`：`export * from './login'`。

- [ ] **Step 3: 改 elogin 内 import**

将 `@api/bussiness/...` 全部改为 `@/api/intl`（或 `@api/intl`，与项目 alias 一致）。

- [ ] **Step 4: 重写 routes.js**

`frameIn` 仅 layout + `index`（home）+ refresh/redirect + 可选 log。  
`frameOut` 仅 `/elogin` + 404/error（若原有）。  
删除 jgt-ui-demo、业务模块 spread、`/login*` 等。

- [ ] **Step 5: 清理 menu / main.js 中对已删模块、electron 的引用**

保证 `npm run serve` 编译不因 missing module 失败。`$isElectron` 可恒为 `false` 的 stub。

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: slim routes, home placeholder, and intl login API layer

EOF
)"
```

---

### Task 5: 安装依赖、启动验证、README

**Files:**
- Create/Modify: `README.md`

**Interfaces:**
- Consumes: Task 3–4 工程
- Produces: 可启动的 dev server；文档说明对接 8090

- [ ] **Step 1: 安装依赖**

```bash
cd /Users/jiangzhongbing/Documents/international/jgt-intl-portal
npm install
```

Expected: 退出码 0（允许 peer dependency warning）

- [ ] **Step 2: 启动并检查编译**

```bash
npm run serve
```

Expected: 编译成功，本地可打开；访问 `/#/elogin` 能看到登录页。

- [ ] **Step 3: 写 README**

内容至少包含：项目说明、与 `bus-jgt-intl` 平级关系、`npm install` / `npm run serve`、`VUE_APP_API=http://localhost:8090`、`src/api/intl` 对接说明。

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
docs: add README for intl portal scaffold

EOF
)"
```

---

## Spec coverage check

| Spec 项 | Task |
| --- | --- |
| 平级独立工程 | 1 |
| 拷贝再裁剪 | 1–2 |
| 去 Electron | 2–3 |
| 保留 elogin | 2、4 |
| api/intl + env/proxy | 3–4 |
| 占位首页 | 4 |
| serve 可启动 + README | 5 |
