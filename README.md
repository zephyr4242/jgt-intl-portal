# jgt-intl-portal

国际业务门户前端脚手架。从 `account-portal` 抽出 Vue 2 + Element UI + d2-admin 框架与通用组件，保留 Web 登录页，并预留对接 `bus-jgt-intl`。

## 目录关系

```
international/
├── bus-jgt-intl/       # 后端（独立仓库，勿与本项目糅合）
└── jgt-intl-portal/    # 本前端工程
```

## 快速开始

```bash
cd /Users/jiangzhongbing/Documents/international/jgt-intl-portal
npm install
npm run serve
```

默认开发地址：`http://localhost:8088/#/elogin`

## 对接 bus-jgt-intl

| 项 | 说明 |
| --- | --- |
| 环境变量 | `.env` / `.env.development` 中 `VUE_APP_API=http://localhost:8090`（与后端 `bootstrap-local.yml` 端口一致） |
| 开发代理 | `vue.config.js` 将 `/api`、`/labrador-gateway` 代理到 `VUE_APP_API` |
| 登录 API | `src/api/intl/login.js`，占位路径 `/api/intl/auth/*`；联调时按后端契约改 path/字段即可 |
| 登录入口 | `/elogin`；成功后进入占位首页 `/index` |

后续新增国际业务接口时，建议继续放在 `src/api/intl/` 下按模块拆分，并从 `src/api/intl/index.js` 导出。

## 脚本

- `npm run serve` / `npm start` / `npm run dev`：本地开发
- `npm run build`：生产构建
- `npm run lint`：ESLint

本工程为纯 Web，已去掉 Electron 桌面端依赖与打包脚本。

## 说明

- 原国内 `src/api/bussiness/*` 已删除；布局等残留引用指向 `src/api/intl/legacy/*` 空 stub（调用会 reject），新接口请写 `src/api/intl/`。
- 设计文档：`docs/superpowers/specs/2026-07-17-jgt-intl-portal-design.md`
- 实施计划：`docs/superpowers/plans/2026-07-17-jgt-intl-portal-scaffold.md`
