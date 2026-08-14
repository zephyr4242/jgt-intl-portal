# jgt-intl-portal 项目文档摘要

## 项目概述

基煜国际 Web 门户（由 account-portal 裁剪），对接 `bus-jgt-intl`。

## 技术栈

Vue 2.6 + Vue Router 3 + Vuex 3 + ElementUI + Axios；JSEncrypt（RSA）；三语 `zh-Hans` / `zh-Hant` / `en`。

## 关键目录

- `src/api/intl/`：正式 API（禁止写 legacy 新接口）
- `src/views/system/elogin`、`eregister`：登录/注册
- `src/libs/demo-auth.js`：演示登录（本变更需替换主路径）
- `src/locales/index.js`：三语文案
- `src/plugin/axios`：请求拦截，Header `token`

## 代理

开发：`/api` → `VUE_APP_API`（默认 `http://localhost:8090`）。本变更对齐后端真实路径 `/bus/jgt/intl/auth/*`。
