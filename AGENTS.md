# AGENTS.md - 国际业务门户（jgt-intl-portal）

## 项目概述

**项目名称**: jgt-intl-portal
**核心职责**: 基煜国际 Web 门户（由 account-portal 整仓拷贝裁剪而来），预留对接 `bus-jgt-intl`
**版本**: 2.0.3

## Tech Stack

### 核心框架
- **Vue**: 2.6.11
- **Vue Router**: 3.1.3
- **Vuex**: 3.1.2
- **ElementUI**: 2.15.6
- **Axios**: 0.21.1

### 客户端
- **Electron**: 19.0.0（桌面客户端，与 Web 端共用代码）

### 工具库
- **dayjs**: 日期处理
- **lodash**: 工具库
- **echarts**: 图表
- **jsencrypt**: RSA 加密
- **vue-ueditor-wrap**: 富文本编辑器

### 构建工具
- **Vue CLI**: 4.5.0
- **Webpack**: 4.x
- **Sass**: 1.38.0

---

## Project Structure

```
jgt-intl-portal/
├── src/
│   ├── api/
│   │   └── intl/               # 国际门户 API（login + legacy stub）
│   ├── assets/                 # 静态资源
│   ├── components/             # 公共组件
│   ├── layout/                 # 布局组件
│   ├── plugin/                 # 插件（axios、error、log）
│   ├── router/                 # 路由配置
│   ├── store/                  # Vuex 状态管理
│   ├── utils/                  # 工具函数
│   └── views/                  # 页面组件（含 system/elogin）
├── public/                     # 静态资源
└── package.json
```

### 入口文件
- **App.vue**: 项目根组件
- **background.js**: Electron 主进程入口

---

## API 规范

### 目录约定（重要）

| 目录 | 定位 | 说明 |
|------|------|------|
| `src/api/intl/` | **国际门户正式 API** | 对接 `bus-jgt-intl`，新接口一律写这里 |
| `src/api/intl/legacy/` | **临时编译 stub** | 原 `src/api/bussiness` 已删除；仅保证旧组件可编译，调用会 `reject`；**禁止新增**；随组件下线逐步删除 |

> 历史说明：脚手架从 `account-portal` 拷贝时曾保留国内 `api/bussiness`。该目录已移除；残留引用统一指向 `api/intl/legacy/*` stub。新业务禁止依赖 legacy。

### API 封装方式

```javascript
import request from '@/plugin/axios'

// 国际门户：写在 src/api/intl/ 下（不要写 legacy）
let getBaseUrl = url => '/api/intl/' + url

// 导出接口
export const someApi = (params, headers = {}) => request.post(getBaseUrl('xxx'), params, { headers })
```

### API 路径规范（国际门户）

| 后端服务 | 前端路径前缀 | 示例 |
|---------|-------------|------|
| bus-jgt-intl（预留） | `/api/intl/` | `/api/intl/auth/login` |

### 请求封装

```javascript
// 使用 @/plugin/axios 的 request 实例
import request from '@/plugin/axios'

// POST 请求
request.post(url, data, config)

// GET 请求
request.get(url, params)
```

---

## 组件规范

### 弹窗组件命名

- 交易确认弹窗: `XxxDialog.vue`
- 弹窗内容组件: `XxxContent.vue`

### 弹窗组件结构

```vue
<template>
  <el-dialog title="提示" width="600px" :visible.sync="visible" ...>
    <XxxContent v-if="contentVisible" :data="popupData" @close="cancel"/>
    <div slot="footer">
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button plain @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'XxxDialog',
  data() {
    return {
      visible: false,
      contentVisible: false,
      popupData: null
    }
  },
  methods: {
    init(data) {
      this.popupData = data
      this.visible = true
    },
    confirm() {
      this.visible = false
      this.$emit('callback', true)
    },
    cancel() {
      this.visible = false
      this.$emit('callback', false)
    }
  }
}
</script>
```

### 组件调用方式

```javascript
// 在父组件中
this.$refs.xxxDialog.init(data)

// 或使用 $dialog
this.$dialog.xxxDialog(data).then(res => {
  // 确认回调
}).catch(() => {
  // 取消回调
})
```

---

## 三语国际化（强制）

**核心原则**：本项目所有面向用户的文案改动，必须同时支持 **简体中文（zh-Hans）**、**繁体中文（zh-Hant）**、**英语（en）**。

### 强制要求

- 新增/修改页面、组件、弹窗、按钮、placeholder、toast、表头、空态、错误提示等用户可见文案时，**三种语言缺一不可**
- 禁止在模板或逻辑中硬编码仅中文文案（演示临时代码须尽快补齐三语）
- 文案统一写入 [`src/locales/index.js`](src/locales/index.js) 的 `MESSAGES`，通过 `this.$t(key)` 取值
- 页面语言切换使用公共组件 [`src/components/jgt-lang-switch`](src/components/jgt-lang-switch)（登录卡 `theme="dark"`，顶栏/注册页 `theme="light"`）
- 语言偏好持久化 key：`localStorage.jiyu_demo_locale`（Vuex：`d2admin/locale`），刷新后保持
- 切换语言后，当前页已展示文案须同步更新（含表单校验错误、动态拼接提示）
- 新增文案 key 命名语义化（如 `loginBtn`、`errorAgree`），三种语言共用同一 key

### 语言代码约定

| 代码 | 语言 |
|------|------|
| `zh-Hans` | 简体中文 |
| `zh-Hant` | 繁体中文 |
| `en` | English |

### 验收自检

- 在登录卡 / 注册页 / 登录后顶栏语言选择中分别切到简/繁/英，关键文案均正确
- 无「一种语言有文案、另外两种显示 key 或空白」的情况
- 切换后刷新页面，语言偏好仍保留

---

## 铁律（交易确认留痕专项）

**核心原则**：`只加留痕，不改任何历史业务逻辑`。

### 强制要求

- 留痕改动仅允许新增：`fireTradeConfirmLog` 调用、留痕上下文字段透传、留痕辅助函数/兜底逻辑
- 禁止因留痕修改历史业务行为：请求参数语义、交易分支、校验条件、提交时机、路由跳转、接口调用链
- 同名业务字段若有“业务值”和“留痕值”差异，必须拆分（如 `businessType` 与 `logBusinessType`），禁止覆盖业务字段
- 新增留痕必须保持向后兼容：顶层 `extra` 兼容旧解析，完整明细进入 `popupContent`
- 任何留痕兜底必须“非阻断”：只能补字段、告警，不得阻断用户交易流程

### 留痕字段最低要求（可得则必传）

- 顶层 `extra`：`businessType`、`fundCode`、`fundName`、`tradeAcco`、`fofundNo`
- 转换场景：补充 `transferContext`（`outFundCode/outFundName/inFundCode/inFundName`）
- 批量场景：在 `popupContent.batchTradeContext.tradeList[]` 中保留每笔最小上下文（同上核心字段 + `accountNo`）

---

## 常用命令

```bash
# Web 开发
npm run serve          # 启动开发服务器
npm run build          # 生产打包

# Electron 客户端
npm run es             # 开发模式启动 Electron
npm run eb:dev         # 开发环境打包 Electron
npm run eb:test        # 测试环境打包
npm run eb:prod        # 生产环境打包

# 代码质量
npm run lint           # ESLint 检查
npm run lint:fix       # ESLint 修复
npm run sonar          # Sonar 代码检查

# 测试
npm run test:unit      # 单元测试
```

---

## OpenSpec 工作流（强制）

| 变更类型 | 是否走 OpenSpec | 说明 |
|---|---|---|
| **大需求 / 新功能** | **必须** | 先 `proposal` → `design` → `specs` → `tasks`，评审通过后再改代码；与后端 `bus-jgt-intl` 同名 change 对齐契约 |
| **缺陷修复 / 小改** | 可不走 | 直接修代码；若改动 API 契约或登录安全策略，建议补简短 design/spec |

路径：`openspec/changes/<change-id>/`（含 `.openspec.yaml`、`proposal.md`、`design.md`、`tasks.md`、`specs/**/spec.md`）。

禁止大需求跳过 OpenSpec 直接编码（紧急热修除外，事后须补文档）。

---

## Do Not Section

- 不要修改 `src/plugin/axios` 的封装逻辑，优先复用现有 request 实例
- 不要在组件中直接使用 `window.location`，使用路由导航
- 不要使用 `v-for` 不带 `key`，或使用非唯一 `key`
- 不要在 `computed` 中修改响应式数据
- 弹窗组件必须使用 `visible.sync` 控制显隐
- API 接口路径必须使用 `getBaseUrl()` 拼接，禁止硬编码
- **禁止向 `src/api/intl/legacy/` 新增接口**；国际业务新接口只写 `src/api/intl/`（非 legacy）
- **禁止恢复或引用已删除的 `src/api/bussiness/`**
- **禁止只交付单语（仅简体）文案**；所有用户可见改动必须覆盖 zh-Hans / zh-Hant / en
- 不要为留痕改动历史业务逻辑（铁律）：不改交易流程、不改原有业务参数语义、不改历史校验与提交行为
- **禁止大需求跳过 OpenSpec 直接实现**
