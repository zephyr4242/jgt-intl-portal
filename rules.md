# rules.md

面向在本仓库内改代码的 AI 与开发者：优先与现有 **Vue 2 + D2 Admin + Element UI** 工程约定保持一致，避免引入第二套请求/路由/状态管理风格。

## 通用规则
1. 先定位再改：同类功能先看同目录页面或 `components` 的实现方式，再复制并裁剪其模式。
2. 小步改动：需求未要求时不做大重构、不升级依赖、不替换 UI/框架。
3. 可验证：路由/API 改动后用 `npm run dev` 打开对应路径验证；涉及请求封装时确认走统一 `src/api`。

## 前端分层规则（边界）
- 页面（`src/views/...`）：负责页面编排与交互流程，尽量保持“薄页面”，复用子组件与 mixin。
- 组件（`src/views/.../components` 或 `src/common/components`）：复用 UI 与交互细节，通过 `props` / `emit` 暴露接口；尽量单一职责。
- API（`src/api/*.js`）：所有后端请求集中管理；优先使用项目已有的 `fetch`/`request` 封装与 gateway 拼接方式。
- 路由（`src/router/`）：只负责 `path/name/meta/component` 的声明与模块合并；新增页面要同时完成路由注册。
- 状态管理（`src/store/`）：主要为 `d2admin` 的全局布局/多标签等能力；新增业务状态优先局部化到组件/页面，避免无意义新增全局模块。

## 代码风格规则
1. 命名：遵循项目周边文件的命名方式，避免引入新的命名体系。
2. 请求：业务请求不要在页面/组件内“裸 axios/fetch”，优先走 `src/api/`。
3. 样式：与同目录页面保持一致（是否 `scoped`、使用 scss/less），依赖全局样式变量时沿用 `public.scss` 的注入方式。
4. 代码组织：优先使用现有的 mixin/公共组件与工具方法，避免在多个页面复制同一套逻辑。

## Do Not（不要做的事）
- ❌ 不要绕过 `src/api` 随意写请求；除非与现有封装行为完全一致且明确有必要。
- ❌ 不要只改菜单或只改路由；页面无法访问或权限/菜单状态可能不同步。
- ❌ 不要引入与当前构建链不兼容的语法/框架升级（例如从 Vue2 全量切到 Vue3/React），除非这是明确任务。
- ❌ 不要提交 token、密钥、内网地址到仓库；环境差异用 `.env` / 运行时 `CONFIG` 约定。

## 验证方式
```bash
# 开发运行
npm run dev

# eslint（提交时 lint-staged 也会触发）
npm run lint

# 单测（如有覆盖）
npm run test:unit

# 生产构建前验证
npm run build
```

## 本仓库关键约定摘要
- 路由为 `hash` 模式，且主路由与 `src/router/modules/*` 通过 `require.context` 组合。
- devServer 端口：`8085`，代理通过 `vue.config.js` 配置 `/soul-gateway`。
- 全局 SCSS 变量通过 `vue.config.js` 注入 `src/assets/style/public.scss`。

