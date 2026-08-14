# jgt-intl-portal 前端脚手架设计

日期：2026-07-17  
状态：已批准（对话确认）  
来源：从 `account-portal` 抽出框架与组件，服务国际业务前端

## 1. 目标

在 `/Users/jiangzhongbing/Documents/international/jgt-intl-portal` 新建**独立**前端工程，与已有后端 `bus-jgt-intl` **平级、互不嵌套**。

从 `account-portal`（Vue 2 + Element UI + d2-admin）整仓拷贝后裁剪，得到：

- 可本地启动的 Web 脚手架
- 保留 Web 登录页（`/elogin`）
- 预留对接 `bus-jgt-intl` 的配置与 API 适配层

## 2. 范围边界

### 2.1 做什么

| 项 | 说明 |
| --- | --- |
| 技术栈 | Vue 2 + Element UI + d2-admin 骨架（布局、路由/store、axios、通用组件） |
| 登录 | 保留 `/elogin` 及 `LoginForm`、header/footer 等支撑 UI |
| 对接预留 | env、devServer proxy、`src/api/intl/` 适配层（含登录可替换 service） |
| 工程形态 | 纯 Web；独立 git 仓库 |

### 2.2 不做什么

| 项 | 说明 |
| --- | --- |
| 业务页 | 不拷贝 `views/business/**`（交易/账户/机构/基金等） |
| Electron | 去掉桌面端依赖、脚本与打包主路径；登录页客户端分支可简化为 Web |
| 真实联调 | 本期不强制打通 `bus-jgt-intl` 真实登录；结构与配置先到位 |
| 后端改动 | 不修改 `bus-jgt-intl` 仓库内容 |

### 2.3 对接预留约定

- 环境变量：沿用并改写 `VUE_APP_API` 作为国际后端基址（默认本地占位，如 `http://localhost:8080`）；另设 `VUE_APP_TITLE` 等展示文案为国际门户相关命名。不另造并行基址变量，避免双源配置。
- 开发代理：`vue.config.js` 的 `devServer.proxy` 预留到 `VUE_APP_API` / `bus-jgt-intl`；真实 context-path / 网关路径联调时再对齐。
- API 层：对外请求统一经 `src/api/intl/`，登录请求走该目录下可替换适配模块，避免散落硬编码旧门户地址。
- 登录路由：以 `/elogin` 为唯一主入口；`/login`、`/login/once`、`/login/again` 若不被 elogin 编译依赖则删除，避免多套登录并存。
- 登录成功后落到简易占位首页（`views/home`），证明布局/路由可用，不依赖原业务模块。

## 3. 实施策略

**整仓拷贝再裁剪（已选）**

1. 复制 `account-portal` 到 `jgt-intl-portal`（排除 `node_modules`、`.git`、构建产物）
2. 删除业务页、Electron、无关 demo/系统页与业务组件
3. 精简 `package.json`、路由、store、menu、API
4. 写入 intl 对接预留（env / proxy / `api/intl`）
5. 改项目名为 `jgt-intl-portal`，补充 README 启动与对接说明

备选（未采用）：白名单目录拷贝、空 Vue 工程再迁入——登录链路与 d2-admin 配置风险更高或成本更大。

## 4. 保留 / 删除清单

### 4.1 保留

- 工程配置：精简后的 `package.json`、`vue.config.js`（Web only）、babel/eslint/postcss、`.env*`、`public/` 基础静态资源
- `src` 核心：`main.js`、`App.vue`、`setting.js`、`layout/`、`plugin/`、`store/`（d2admin）、`libs/`、`mixins/`、`directives/`、`assets/`、`config/`、精简后的 `menu/`、`components/`（通用 `d2-*` / `jy-*` / `jgt-*`）
- 系统页：`views/system/elogin/**`；必要的 `error` / `loading` / `function`（refresh/redirect）
- API：axios 封装 + **新建** `src/api/intl/`（含 login 适配）；原业务 API 清空或仅保留登录所需适配依赖

### 4.2 删除 / 剥离

- 全部 `views/business/**` 与业务路由模块（trade / account / org / fund / ir / help-center 等）
- Electron：依赖、npm scripts、`background.js`、electron-builder 配置块等
- `jgt-ui-demo`、客户端下载 / 柜面等非骨架系统页（除非登录编译强依赖，否则删除）
- 业务专用组件（如费用明细类）、桌面证书/安装脚本等

## 5. 目标目录结构

```
international/
├── bus-jgt-intl/              # 已有后端（不动）
└── jgt-intl-portal/           # 本前端工程
    ├── package.json
    ├── vue.config.js
    ├── .env*
    ├── public/
    ├── docs/superpowers/specs/
    └── src/
        ├── api/
        │   └── intl/          # 对接 bus-jgt-intl 预留
        ├── components/
        ├── layout/
        ├── plugin/
        ├── router/            # elogin + 占位首页 + 系统必要路由
        ├── store/
        ├── views/
        │   ├── system/elogin/
        │   └── home/          # 登录后占位首页
        └── ...
```

## 6. 验收标准

1. `jgt-intl-portal` 与 `bus-jgt-intl` 平级，互不嵌套
2. `npm install` + `npm run serve` 可启动
3. 浏览器可打开 Web 登录页（`/elogin`）
4. 登录成功进入占位首页（不依赖原业务模块）
5. 存在 `api/intl` + env/proxy 预留；README 说明如何改为对接 `bus-jgt-intl`
6. 无 Electron 作为主启动/打包路径

## 7. 风险与后续

| 风险 | 缓解 |
| --- | --- |
| 登录依赖链残留引用业务模块 | 裁剪后全量搜引用；缺依赖用 stub 或删分支 |
| 旧门户 API 路径与 intl 不一致 | 适配层集中映射；联调阶段再对齐契约 |
| 裁剪过猛导致样式/布局缺失 | 优先保留 layout 与 d2-container 相关组件 |

后续（本设计范围外）：对齐 `bus-jgt-intl` 真实登录契约并完成联调；按国际业务逐步加页面。
