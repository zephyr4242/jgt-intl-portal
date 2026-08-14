import dayjs from 'dayjs'
import { saveTradeConfirmRecord } from '@/api/intl/legacy/bus-jgt-trade'
import constant from '@/libs/constant'

/**
 * 留痕用时间字符串：浏览器本地时区的 `YYYY-MM-DD HH:mm:ss`（非 UTC，与 OpenSpec 契约一致）。
 * 用于 popupOpenTime / popupCloseTime、domEvidence.extractedAt、htmlEvidence.capturedAt 等。
 */
export function localTradeConfirmTimeString () {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

function resolveMenuName (vm, opts) {
  if (opts.extra && opts.extra.menuName !== undefined) return opts.extra.menuName
  const route = vm.$route || {}
  if (route.meta && route.meta.title) return route.meta.title
  if (Array.isArray(route.matched) && route.matched.length) {
    const matchedTitle = [...route.matched].reverse().find(item => item && item.meta && item.meta.title)
    if (matchedTitle && matchedTitle.meta && matchedTitle.meta.title) return matchedTitle.meta.title
  }
  return route.name || undefined
}

function getByPath (obj, path) {
  if (!obj || !path) return undefined
  const parts = String(path).split('.')
  let cur = obj
  for (const p of parts) {
    if (cur == null) return undefined
    cur = cur[p]
  }
  return cur
}

function pickFirst (obj, paths) {
  for (const path of paths) {
    const v = getByPath(obj, path)
    if (v !== undefined && v !== null && v !== '') return v
  }
  return undefined
}

/** extra 合并后可能带 null/空串，不能视为「已提供」，否则短路 pickFirst 后 vm 上明明有账号也补不到 */
function extraHasEffectiveValue (v) {
  if (v === undefined || v === null) return false
  if (typeof v === 'string' && v.trim() === '') return false
  return true
}

function normalizeText (s, maxLen) {
  if (s == null) return ''
  const t = String(s)
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim()
  if (!maxLen || t.length <= maxLen) return t
  return t.slice(0, maxLen)
}

function uniqNonEmpty (arr) {
  const out = []
  const seen = new Set()
  for (const item of arr || []) {
    const v = normalizeText(item, 0)
    if (!v) continue
    if (seen.has(v)) continue
    seen.add(v)
    out.push(v)
  }
  return out
}

function isVisibleEl (el) {
  try {
    if (!el) return false
    if (el.getAttribute && el.getAttribute('aria-hidden') === 'true') return false
    const style = window.getComputedStyle ? window.getComputedStyle(el) : null
    if (!style) return true
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
  } catch (e) {
    console.warn('[trade-confirm-log] isVisibleEl failed, treat as not visible', e)
    return false
  }
}

function getDialogTitleText (dialogEl) {
  try {
    const header = dialogEl && dialogEl.querySelector ? dialogEl.querySelector('.el-dialog__header') : null
    const titleEl = header && header.querySelector ? (header.querySelector('.el-dialog__title') || header) : null
    return normalizeText(titleEl ? titleEl.textContent : '', 256)
  } catch (e) {
    return ''
  }
}

/**
 * 留痕专用：从 el-dialog 组件 ref 解析 `.el-dialog` 根节点。
 * 须在关窗前调用，传入 opts._dialogEl，避免关窗后 nextTick 全局扫描串单。
 */
export function getTradeConfirmDialogEl (dialogVmRef) {
  try {
    if (!dialogVmRef || !dialogVmRef.$el) return undefined
    const el = dialogVmRef.$el
    if (el.matches && el.matches('.el-dialog')) return el
    const inner = el.querySelector && el.querySelector('.el-dialog')
    return inner || undefined
  } catch (e) {
    return undefined
  }
}

function getDialogEl (vm, opts) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return undefined
  const explicitDialogEl = opts && opts._dialogEl
  // 显式锚点：不校验可见性，关窗后仍指向本次业务弹窗 DOM（与 fofund-adviser 对齐）
  if (explicitDialogEl) return explicitDialogEl
  const tcLogId = opts && opts._tcLogId ? String(opts._tcLogId) : ''
  if (tcLogId) {
    const locked = document.querySelector(`[data-tc-log-id="${tcLogId}"]`)
    if (locked) return locked
  }
  const root = (vm && vm.$el) ? vm.$el : document.body
  const desiredTitle = normalizeText(opts && opts.popupMeta && opts.popupMeta.popupName, 256)
  const collectVisible = (container) => {
    if (!container || !container.querySelectorAll) return []
    const list = []
    const pushAll = (nodes) => {
      [...(nodes || [])].forEach(n => { if (n) list.push(n) })
    }
    pushAll(container.querySelectorAll('.el-dialog__wrapper .el-dialog'))
    pushAll(container.querySelectorAll('.el-dialog'))
    return list.filter(isVisibleEl)
  }
  const pickByTitle = (candidates) => {
    if (!candidates || !candidates.length) return undefined
    if (!desiredTitle) return candidates[candidates.length - 1]
    const exact = candidates.find(d => getDialogTitleText(d) === desiredTitle)
    if (exact) return exact
    const partial = candidates.find(d => getDialogTitleText(d).includes(desiredTitle) || desiredTitle.includes(getDialogTitleText(d)))
    if (partial) return partial
    return undefined
  }

  // 优先当前组件根节点范围，避免同标题弹窗串台
  const rootCandidates = collectVisible(root)
  const rootPicked = pickByTitle(rootCandidates)
  if (rootPicked) return rootPicked
  if (rootCandidates.length && !desiredTitle) return rootCandidates[rootCandidates.length - 1]

  // 回退全局可见弹窗
  const docCandidates = collectVisible(document)
  const docPicked = pickByTitle(docCandidates)
  if (docPicked) return docPicked
  return docCandidates.length ? docCandidates[docCandidates.length - 1] : undefined
}

function getDialogBodyEl (vm, opts) {
  const explicitBodyEl = opts && opts._dialogBodyEl
  // 显式传入的 body 节点优先信任：点击确认瞬间可能进入过渡态，不应因“不可见”判定被丢弃
  if (explicitBodyEl) return explicitBodyEl
  const dialogEl = getDialogEl(vm, opts)
  if (!dialogEl || !dialogEl.querySelector) return undefined
  // 没有 body 时不要回退到整个 dialog，避免抓错内容（例如 DeviceMgr 这种空壳）
  return dialogEl.querySelector('.el-dialog__body') || undefined
}

function genTcLogId () {
  try {
    const ts = Date.now()
    const rand = Math.random().toString(16).slice(2, 10)
    return `tc_${ts}_${rand}`
  } catch (e) {
    return `tc_${Date.now()}`
  }
}

function lockDialogForTc (vm, opts) {
  try {
    if (!opts || !opts._tcLogId) return
    const dialogEl = getDialogEl(vm, opts)
    if (!dialogEl || !dialogEl.setAttribute) return
    dialogEl.setAttribute('data-tc-log-id', String(opts._tcLogId))
    if (opts.popupMeta && opts.popupMeta.popupCode) {
      dialogEl.setAttribute('data-tc-popup-code', String(opts.popupMeta.popupCode))
    }
  } catch (e) {}
}

function safeDomTextSnapshot (vm, opts) {
  try {
    const dialogEl = getDialogEl(vm, opts)
    if (!dialogEl) return undefined

    const header = dialogEl.querySelector('.el-dialog__header')
    const body = dialogEl.querySelector('.el-dialog__body')
    const footer = dialogEl.querySelector('.el-dialog__footer')

    const footerText = (() => {
      try {
        if (!footer) return ''
        const cloned = footer.cloneNode(true)
        ;[...(cloned.querySelectorAll ? cloned.querySelectorAll('button') : [])].forEach(b => b && b.parentNode && b.parentNode.removeChild(b))
        return normalizeText(cloned.textContent || '', 512)
      } catch (e) {
        return ''
      }
    })()

    const titleText = normalizeText(
      (header && (header.querySelector('.el-dialog__title') || header).textContent) ||
      (opts && opts.popupMeta && opts.popupMeta.popupName) ||
      '',
      256
    )
    const bodyText = normalizeText((body || dialogEl).textContent || '', 4000)

    const btnTexts = uniqNonEmpty([...(footer ? footer.querySelectorAll('button') : [])].map(b => b && b.textContent))
      .map(t => normalizeText(t, 32))
      .slice(0, 10)

    const checkboxTexts = uniqNonEmpty([...(body ? body.querySelectorAll('.el-checkbox') : [])].map(el => el && el.textContent))
      .map(t => normalizeText(t, 128))
      .slice(0, 20)

    return {
      extractedAt: localTradeConfirmTimeString(),
      titleText,
      bodyText,
      footerText,
      footerButtons: btnTexts,
      checkboxes: checkboxTexts
    }
  } catch (e) {
    return undefined
  }
}

function fnv1a32 (str) {
  let hash = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0
  }
  return ('0000000' + hash.toString(16)).slice(-8)
}

function sanitizeHtmlClone (el) {
  const clone = el.cloneNode(true)
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT, null, false)
  const toRemove = []
  while (walker.nextNode()) {
    const node = walker.currentNode
    const tag = (node.tagName || '').toLowerCase()
    if (tag === 'script' || tag === 'style') {
      toRemove.push(node)
      continue
    }
    // 去掉所有 on* 事件属性，避免带入执行上下文
    const attrs = [...(node.attributes || [])]
    for (const a of attrs) {
      const name = (a && a.name) ? String(a.name).toLowerCase() : ''
      if (name.startsWith('on')) node.removeAttribute(a.name)
    }
    // 表单值脱敏：不记录用户输入
    if (tag === 'input' || tag === 'textarea') {
      node.setAttribute('value', '')
      node.value = ''
    }
  }
  for (const n of toRemove) {
    if (n && n.parentNode) n.parentNode.removeChild(n)
  }
  return clone
}

function safeDomHtmlSnapshot (vm, opts) {
  try {
    const explicitHtmlEvidence = opts && opts._htmlEvidence
    if (explicitHtmlEvidence && typeof explicitHtmlEvidence === 'object') {
      return {
        ...explicitHtmlEvidence,
        capturedAt: explicitHtmlEvidence.capturedAt || localTradeConfirmTimeString()
      }
    }
    const dialogEl = getDialogEl(vm, opts)
    const bodyEl = getDialogBodyEl(vm, opts) || (dialogEl && dialogEl.querySelector ? dialogEl.querySelector('.el-dialog__body') : null)
    let targetEl = bodyEl
    let selector = '.el-dialog__body'
    // 兜底：确实找不到 body 时才抓整个 dialog，避免 htmlEvidence 缺失
    if (!targetEl) {
      targetEl = dialogEl
      selector = '.el-dialog'
    }
    if (!targetEl) return undefined
    const cloned = sanitizeHtmlClone(targetEl)
    const outerHTML = cloned && cloned.outerHTML ? String(cloned.outerHTML) : ''
    const originalLength = outerHTML.length
    // 默认不截断（合规尽量不遗漏），但为避免请求体过大导致上报失败/卡顿，设置业务保护阈值
    const safetyCap = (opts && opts.extra && opts.extra.htmlSafetyCap != null)
      ? Number(opts.extra.htmlSafetyCap)
      : 1000000
    const overCap = safetyCap > 0 && originalLength > safetyCap
    const truncated = overCap
    const trimmed = overCap ? outerHTML.slice(0, safetyCap) : outerHTML
    const out = {
      selector,
      capturedAt: localTradeConfirmTimeString(),
      truncated,
      originalLength,
      hash: fnv1a32(trimmed),
      bodyOuterHTML: trimmed
    }
    // 默认采集 footer HTML（与 body 一致，覆盖所有留痕弹窗）；extra.captureFooterHtml === false 可关闭
    const extra = (opts && opts.extra) || {}
    const captureFooterHtml = extra.captureFooterHtml !== false
    if (captureFooterHtml) {
      const dialogEl = getDialogEl(vm, opts)
      const footerEl = dialogEl && dialogEl.querySelector ? dialogEl.querySelector('.el-dialog__footer') : null
      if (footerEl) {
        const footerCloned = sanitizeHtmlClone(footerEl)
        const footerOuterHTML = footerCloned && footerCloned.outerHTML ? String(footerCloned.outerHTML) : ''
        const footerOriginalLength = footerOuterHTML.length
        const footerCap = (extra.footerHtmlSafetyCap != null)
          ? Number(extra.footerHtmlSafetyCap)
          : safetyCap
        const footerOver = footerCap > 0 && footerOriginalLength > footerCap
        const footerTrimmed = footerOver ? footerOuterHTML.slice(0, footerCap) : footerOuterHTML
        out.footerSelector = '.el-dialog__footer'
        out.footerTruncated = footerOver
        out.footerOriginalLength = footerOriginalLength
        out.footerHash = fnv1a32(footerTrimmed)
        out.footerOuterHTML = footerTrimmed
      }
    }
    return out
  } catch (e) {
    return undefined
  }
}

export function captureTradeConfirmHtmlEvidence (vm, opts) {
  try {
    return safeDomHtmlSnapshot(vm, opts || {})
  } catch (e) {
    return undefined
  }
}

function isTextMostlyContained (needle, haystack) {
  const n = normalizeText(needle, 0)
  const h = normalizeText(haystack, 0)
  if (!n || !h) return false
  if (h.includes(n)) return true
  const nn = n.replace(/\n/g, '')
  const hh = h.replace(/\n/g, '')
  if (!nn || !hh) return false
  return hh.includes(nn)
}

function mergeDomEvidence (baseObj, domEvidence) {
  if (!domEvidence) return undefined
  const out = { ...domEvidence }

  // 风险揭示类弹窗：riskPoints 已经是结构化列表，checkboxes 往往是同一批文案的重复采样
  const riskPoints = baseObj && Array.isArray(baseObj.riskPoints) ? baseObj.riskPoints : null
  if (riskPoints && out.checkboxes && Array.isArray(out.checkboxes) && out.checkboxes.length) {
    const rpSet = new Set((riskPoints || []).map(x => normalizeText(x, 0)).filter(Boolean))
    const cbSet = new Set((out.checkboxes || []).map(x => normalizeText(x, 0)).filter(Boolean))
    // 只要两者高度重合（任一方是另一方的子集），就认为是重复采样，删掉 checkboxes
    const isSubset = (a, b) => {
      for (const v of a) { if (!b.has(v)) return false }
      return true
    }
    if (rpSet.size && cbSet.size && (isSubset(cbSet, rpSet) || isSubset(rpSet, cbSet))) {
      delete out.checkboxes
    } else {
      const rp = normalizeText(riskPoints.join('\n'), 0)
      const cb = normalizeText(out.checkboxes.join('\n'), 0)
      if (rp && cb && (isTextMostlyContained(rp, cb) || isTextMostlyContained(cb, rp))) {
        delete out.checkboxes
      }
    }
  }

  const popupBody = baseObj && (baseObj.popupBody || baseObj.body || baseObj.message)
  if (popupBody && out.bodyText && isTextMostlyContained(popupBody, out.bodyText)) {
    delete out.bodyText
  }
  if (baseObj && baseObj.popupName && out.titleText && String(baseObj.popupName).trim() === String(out.titleText).trim()) {
    delete out.titleText
  }
  if (Object.keys(out).length === 1 && out.extractedAt) return undefined
  return out
}

function normalizeBusinessType (value) {
  if (value == null || value === '') return undefined
  const v = String(value).trim()
  const businessCode = (constant && constant.BUSINESSCODE) || {}
  const businessType = (constant && constant.BUSINESS_TYPE) || {}
  const businessCodeSet = new Set(Object.values(businessCode).filter(Boolean).map(x => String(x)))
  // 仅留痕归一化：把前端业务枚举转开放式基金业务码，不改任何业务入参逻辑
  const typeToCodeMap = {
    [businessType.SUBSCRIPTION]: businessCode.SUBSCRIPTION, // 10 -> 020
    [businessType.BUY]: businessCode.PURCHASE, // 20 -> 022
    [businessType.PRE_PURCHASE]: businessCode.PURCHASE, // 21 -> 022
    [businessType.BATCH_BUY]: businessCode.PURCHASE, // 22 -> 022
    [businessType.P_SUB]: businessCode.SUBSCRIPTION, // 30 -> 020
    [businessType.P_BUY]: businessCode.PURCHASE, // 40 -> 022
    [businessType.REDEEM]: businessCode.REDEEM, // 70 -> 024
    [businessType.TRANS]: businessCode.TRANSFER, // 80 -> 036
    [businessType.REVERT]: businessCode.CANCEL // 95 -> 053
  }
  // 已经是开放式基金业务码（纯数字）
  if (/^\d+$/.test(v)) {
    if (businessCodeSet.has(v)) return v
    return typeToCodeMap[v] || v
  }
  // 兼容直接传常量 key，例如 SUBSCRIPTION/BUY/TRANS
  if (businessType[v] != null) {
    const bt = String(businessType[v])
    return typeToCodeMap[bt] || bt
  }
  if (businessCode[v] != null) {
    return String(businessCode[v])
  }
  // 兼容中文（历史 businessFmt 混入 businessType）
  const cnMap = {
    '认购': businessCode.SUBSCRIPTION,
    '申购': businessCode.PURCHASE,
    '加入预购': businessCode.PURCHASE,
    '预购': businessCode.PURCHASE,
    '批量申购': businessCode.PURCHASE,
    '赎回': businessCode.REDEEM,
    '转换': businessCode.TRANSFER,
    '撤单': businessCode.CANCEL,
    '立即签署': businessCode.SUBSCRIPTION,
    '签署': businessCode.SUBSCRIPTION,
    '签署并购买': businessCode.PURCHASE,
    '签署并申购': businessCode.PURCHASE,
    '签署并认购': businessCode.SUBSCRIPTION,
    '普通转换': businessCode.TRANSFER,
    '超级转换': businessCode.TRANSFER,
    '实时超级转换': businessCode.TRANSFER,
    '非实时超级转换': businessCode.TRANSFER
  }
  return cnMap[v]
}

function maybeOmitRiskPointsWhenHtml (target, htmlEvidence, opts) {
  const extra = (opts && opts.extra) || {}
  if (!extra.omitRiskPointsWhenHtml) return
  if (htmlEvidence && htmlEvidence.bodyOuterHTML && target && Array.isArray(target.riskPoints)) {
    delete target.riskPoints
  }
}

/**
 * htmlEvidence 齐备后与 popupContent 去重：有 body HTML 则删 popupBody、dom 正文/标题、checkboxes（勾选区已在 HTML 内）；
 * 有 footer HTML 则删 footer 文本/按钮快照；body + footer HTML 均存在时整段删除 domEvidence（与 HTML 完全重复）。
 */
function pruneRedundantFieldsAfterHtmlEvidence (target, htmlEvidence) {
  if (!target || !htmlEvidence) return
  const hasBody = !!(htmlEvidence.bodyOuterHTML)
  const hasFooter = !!(htmlEvidence.footerOuterHTML)
  if (hasBody && target.popupBody) delete target.popupBody
  const de = target.domEvidence
  if (!de || typeof de !== 'object') return
  if (hasBody) {
    if (de.bodyText) delete de.bodyText
    if (de.titleText) delete de.titleText
    if (Array.isArray(de.checkboxes)) delete de.checkboxes
  }
  if (hasFooter) {
    if (de.footerText) delete de.footerText
    if (de.footerButtons) delete de.footerButtons
  }
  if (hasBody && hasFooter) {
    delete target.domEvidence
    return
  }
  if (Object.keys(de).length === 1 && de.extractedAt) delete target.domEvidence
}

// 留痕侧后处理：仅规范日志内容，不影响页面业务逻辑
function postProcessPopupContentForLog (target) {
  if (!target || typeof target !== 'object') return
  const docs = Array.isArray(target.documents) ? target.documents : null
  if (!docs || !docs.length) return

  const existsWithFund = new Set()
  docs.forEach(d => {
    if (!d || typeof d !== 'object') return
    if (!d.fundCode && !d.fundName) return
    const k = `${d.fileId || ''}__${d.fileName || ''}__${d.signPhase || ''}__${d.needSign ? '1' : '0'}`
    existsWithFund.add(k)
  })

  const seen = new Set()
  const nextDocs = []
  docs.forEach(d => {
    if (!d || typeof d !== 'object') return
    const base = `${d.fileId || ''}__${d.fileName || ''}__${d.signPhase || ''}__${d.needSign ? '1' : '0'}`
    // 如果同一文档已经存在“带基金上下文”的记录，丢弃“无基金上下文”的重复记录
    if (!d.fundCode && !d.fundName && existsWithFund.has(base)) return
    const key = `${d.fundCode || ''}__${d.fundName || ''}__${base}`
    if (seen.has(key)) return
    seen.add(key)
    nextDocs.push(d)
  })
  target.documents = nextDocs

  if (!target.batchTradeContext || typeof target.batchTradeContext !== 'object') {
    const fundSeen = new Set()
    const fundList = []
    nextDocs.forEach(d => {
      if (!d || typeof d !== 'object') return
      if (!d.fundCode && !d.fundName) return
      const key = `${d.fundCode || ''}__${d.fundName || ''}`
      if (fundSeen.has(key)) return
      fundSeen.add(key)
      fundList.push({ fundCode: d.fundCode, fundName: d.fundName })
    })
    if (fundList.length > 1) {
      target.batchTradeContext = { fundCount: fundList.length, fundList }
    }
  }
}

/** 聚合/批量场景批次号：仅写入 popupContent，不参与业务接口 */
function pickChannelBatchContextForPopup (opts) {
  const raw = opts && opts.extra && opts.extra.channelBatchContext
  if (!raw || typeof raw !== 'object') return undefined
  const batchNo = raw.batchNo != null && String(raw.batchNo).trim() !== '' ? String(raw.batchNo).trim() : undefined
  const batchId = raw.batchId != null && String(raw.batchId).trim() !== '' ? String(raw.batchId).trim() : undefined
  const source = raw.source != null && String(raw.source).trim() !== '' ? String(raw.source).trim() : undefined
  if (!batchNo && !batchId && !source) return undefined
  const out = {}
  if (batchNo) out.batchNo = batchNo
  if (batchId) out.batchId = batchId
  if (source) out.source = source
  return out
}

function buildPopupContentString (vm, opts) {
  // 合规级 0 串台：先把本次留痕唯一键绑定到目标弹窗 DOM，再抓取证据
  lockDialogForTc(vm, opts)
  const domEvidence = safeDomTextSnapshot(vm, opts)
  const htmlEvidence = safeDomHtmlSnapshot(vm, opts)
  const transferContext = (opts && opts.extra && opts.extra.transferContext && typeof opts.extra.transferContext === 'object')
    ? opts.extra.transferContext
    : undefined
  const channelBatchContext = pickChannelBatchContextForPopup(opts)
  const c = opts && opts.popupContent

  if (typeof c === 'string') {
    // 尽量保持兼容：若是 JSON 字符串则补充 domEvidence；否则不强行改变结构
    try {
      const parsed = JSON.parse(c)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const merged = mergeDomEvidence(parsed, domEvidence)
        if (merged) parsed.domEvidence = merged
        if (htmlEvidence) parsed.htmlEvidence = htmlEvidence
        if (opts && opts._tcLogId) {
          parsed.trace = parsed.trace && typeof parsed.trace === 'object' ? parsed.trace : {}
          parsed.trace.tcLogId = String(opts._tcLogId)
        }
        if (transferContext) parsed.transferContext = transferContext
        if (channelBatchContext) parsed.channelBatchContext = channelBatchContext
        pruneRedundantFieldsAfterHtmlEvidence(parsed, htmlEvidence)
        maybeOmitRiskPointsWhenHtml(parsed, htmlEvidence, opts)
        postProcessPopupContentForLog(parsed)
        return JSON.stringify(parsed)
      }
    } catch (e) {}
    // 非 JSON 字符串：包装为对象，确保仍能追加 htmlEvidence/documents 等结构化信息
    const wrapped = {
      snapshotVersion: 'v1',
      popupBody: c
    }
    if (htmlEvidence) wrapped.htmlEvidence = htmlEvidence
    const merged = mergeDomEvidence(wrapped, domEvidence)
    if (merged) wrapped.domEvidence = merged
    if (opts && opts._tcLogId) {
      wrapped.trace = wrapped.trace && typeof wrapped.trace === 'object' ? wrapped.trace : {}
      wrapped.trace.tcLogId = String(opts._tcLogId)
    }
    if (transferContext) wrapped.transferContext = transferContext
    if (channelBatchContext) wrapped.channelBatchContext = channelBatchContext
    pruneRedundantFieldsAfterHtmlEvidence(wrapped, htmlEvidence)
    maybeOmitRiskPointsWhenHtml(wrapped, htmlEvidence, opts)
    postProcessPopupContentForLog(wrapped)
    return JSON.stringify(wrapped)
  }

  const obj = (c && typeof c === 'object') ? c : {}
  const merged = mergeDomEvidence(obj, domEvidence)
  if (merged) obj.domEvidence = merged
  if (htmlEvidence) obj.htmlEvidence = htmlEvidence
  if (opts && opts._tcLogId) {
    obj.trace = obj.trace && typeof obj.trace === 'object' ? obj.trace : {}
    obj.trace.tcLogId = String(opts._tcLogId)
  }
  if (transferContext) obj.transferContext = transferContext
  if (channelBatchContext) obj.channelBatchContext = channelBatchContext
  pruneRedundantFieldsAfterHtmlEvidence(obj, htmlEvidence)
  maybeOmitRiskPointsWhenHtml(obj, htmlEvidence, opts)
  postProcessPopupContentForLog(obj)
  return JSON.stringify(obj)
}

/** 沿父链读取 TradeVerify.tcRiskMismatchExtra（22010050），不修改业务弹窗实现 */
function getTradeVerifyRiskMismatchExtra (vm) {
  let cur = vm
  for (let i = 0; i < 12 && cur; i++) {
    const bag = cur.tcRiskMismatchExtra
    if (bag && typeof bag === 'object') return bag
    cur = cur.$parent
  }
  return {}
}

/** 从当前组件 $route 只读补 fundCode/fundName（私募/资管详情等），供承诺函等未在 extra 显式传产品的场景 */
function getVmRouteFundLogExtra (vm) {
  try {
    const r = vm && vm.$route
    if (!r) return {}
    const p = r.params || {}
    const q = r.query || {}
    const code = [p.productCode, p.fundCode, q.productCode, q.fundCode].find(
      v => v !== undefined && v !== null && String(v).trim() !== ''
    )
    const name = [q.fundName, q.productName, q.prodName].find(
      v => v !== undefined && v !== null && String(v).trim() !== ''
    )
    const out = {}
    if (code != null) out.fundCode = String(code).trim()
    if (name != null) out.fundName = String(name).trim()
    return out
  } catch (e) {
    return {}
  }
}

/** 下层（父链/路由）补全后，rawExtra 仅在有「有效值」时覆盖，避免 fundCode: undefined 盖掉 tcRiskMismatchExtra */
function mergeExtraLayers (parentBag, routeBag, rawExtra) {
  const raw = rawExtra && typeof rawExtra === 'object' ? rawExtra : {}
  const extra = { ...parentBag, ...routeBag }
  const keys = Object.keys(raw)
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i]
    const v = raw[k]
    if (v === undefined || v === null || v === '') continue
    extra[k] = v
  }
  for (let j = 0; j < keys.length; j++) {
    const k = keys[j]
    if (!(k in extra)) extra[k] = raw[k]
  }
  return extra
}

function resolveExtra (vm, opts) {
  const rawExtra = (opts && opts.extra) || {}
  const extra = mergeExtraLayers(
    getTradeVerifyRiskMismatchExtra(vm),
    getVmRouteFundLogExtra(vm),
    rawExtra
  )

  const resolvedTradeAcco = extraHasEffectiveValue(extra.tradeAcco)
    ? extra.tradeAcco
    : pickFirst(vm, [
      'tradeAcco',
      // 部分聚合/批量接口返回字段
      'thirdAcco',
      'data.tradeAcco',
      'data.thirdAcco',
      'params.tradeAcco',
      'params.thirdAcco',
      'trade.tradeAcco',
      'trade.thirdAcco',
      'trade.buyData.tradeAcco',
      'trade.buyData.thirdAcco',
      'trade.transferData.tradeAcco',
      'trade.transferData.thirdAcco',
      'info.userLoginCustomer.tradeAcco'
    ])

  const resolvedFofundNo = extraHasEffectiveValue(extra.fofundNo)
    ? extra.fofundNo
    : pickFirst(vm, [
      'fofundNo',
      'data.fofundNo',
      'params.fofundNo',
      'trade.fofundNo',
      'trade.buyData.fofundNo',
      'trade.transferData.fofundNo',
      // account-portal 真实基煜号字段优先
      'info.userLoginCustomer.fofundNo',
      // 兼容历史字段（但优先级应低于 fofundNo）
      'info.userLoginCustomer.thirdAcco'
    ])

  const resolvedFundCode = extra.fundCode !== undefined
    ? extra.fundCode
    : pickFirst(vm, [
      'fundCode',
      'productCode',
      'prodCode',
      'otherFundCode',
      'data.fundCode',
      'data.productCode',
      'baseInfo.fundCode',
      'baseInfo.productCode',
      'buyFundInfo.fundCode',
      'holdInfo.fundCode',
      'params.fundCode',
      'params.productCode',
      'trade.buyData.fundCode',
      'trade.transferData.inFundCode',
      'trade.transferData.outFundCode'
    ])

  const resolvedFundName = extra.fundName !== undefined
    ? extra.fundName
    : pickFirst(vm, [
      'fundName',
      'productName',
      'prodName',
      'otherFundName',
      'data.fundName',
      'data.productName',
      'baseInfo.fundName',
      'baseInfo.productName',
      'buyFundInfo.fundName',
      'holdInfo.fundName',
      'params.fundName',
      'params.productName',
      'trade.buyData.fundName',
      'trade.transferData.inFundName',
      'trade.transferData.outFundName'
    ])

  // 铁律：业务展示用 businessType 与留痕语义不一致时，仅 extra.logBusinessType 参与上报归一
  const { logBusinessType: extraLogBusinessType, ...extraForSpread } = extra
  let resolvedBusinessType = extraHasEffectiveValue(extraLogBusinessType)
    ? extraLogBusinessType
    : extraHasEffectiveValue(extra.businessType)
      ? extra.businessType
      : pickFirst(vm, [
        'businessType',
        'businessFmt',
        'params.businessType',
        'trade.buyData.businessType',
        'trade.transferData.businessType'
      ])

  // 转换留痕：若未带上 logBusinessType 但已有完整 transferContext，按 TRANS 兜底（仅上报口径，不触业务）
  if (!extraHasEffectiveValue(resolvedBusinessType)) {
    const tc = extra.transferContext && typeof extra.transferContext === 'object' ? extra.transferContext : null
    if (tc) {
      const tcOut = tc.outFundCode || tc.outFundName
      const tcIn = tc.inFundCode || tc.inFundName
      if (extraHasEffectiveValue(tcOut) && extraHasEffectiveValue(tcIn)) {
        const trans = constant.BUSINESS_TYPE && constant.BUSINESS_TYPE.TRANS
        if (trans != null && trans !== '') resolvedBusinessType = trans
      }
    }
  }

  return {
    ...extraForSpread,
    tradeAcco: resolvedTradeAcco,
    // 防呆：避免把交易账号误写进基煜账号
    fofundNo: (resolvedTradeAcco && resolvedFofundNo && String(resolvedTradeAcco) === String(resolvedFofundNo))
      ? undefined
      : resolvedFofundNo,
    businessType: normalizeBusinessType(resolvedBusinessType),
    fundCode: resolvedFundCode,
    fundName: resolvedFundName
  }
}

/**
 * 用户显式确认后异步上报留痕，失败仅 console，不阻断主流程。
 * @param {Vue} vm 组件 this（需有 util、$route；建议已 mapState user info）
 * @param {Object} opts
 * @param {{ popupCode: string, popupName: string, popupType: string }} opts.popupMeta（popupName 与页面 el-dialog 的 title 一致，便于与界面展示对齐）
 * @param {Object|string} opts.popupContent
 *  - 若为对象：将自动 JSON.stringify，保证后端按 JSON 字符串接收
 *  - 若为 JSON 字符串：将原样透传
 * @param {string} opts.popupOpenTime
 * @param {string} opts.popupCloseTime
 * @param {Object} [opts.extra] tradeAcco fofundNo menuName businessType fundCode fundName；captureFooterHtml 默认 true，传 false 时不采 footer HTML
 * @param {string} [opts.popupRemark] 业务说明（与 popupCode 对应），补充 title 为「提示」等无法区分的场景；最长 512 字
 * @param {HTMLElement} [opts._dialogEl] 本次弹窗根节点（建议关窗前 getTradeConfirmDialogEl(ref)；MessageBox 等可传实例 $el）
 * @param {HTMLElement} [opts._dialogBodyEl] 可选，显式 body
 */
export function fireTradeConfirmLog (vm, opts) {
  try {
    opts = opts || {}
    if (!opts._tcLogId) opts._tcLogId = genTcLogId()
    const resolvedExtra = resolveExtra(vm, opts || {})
    let deviceId
    try {
      deviceId = vm.util && typeof vm.util.getMachineId === 'function' ? vm.util.getMachineId() : undefined
    } catch (e) {
      deviceId = undefined
    }
    const platform = vm.util && vm.util.isElectron && vm.util.isElectron() ? 'APP' : 'WEB'
    const menuPath = (vm.$route && vm.$route.fullPath) ? String(vm.$route.fullPath) : ''
    const menuName = resolveMenuName(vm, opts)
    const info = vm.info
    const payload = {
      sourceSystem: 'JGT',
      platform,
      popupCode: opts.popupMeta.popupCode,
      popupName: opts.popupMeta.popupName,
      popupType: opts.popupMeta.popupType,
      // 契约：popupContent 为 JSON 字符串；B 方案额外补充 DOM 文本证据（domEvidence）
      popupContent: buildPopupContentString(vm, opts),
      popupOpenTime: opts.popupOpenTime,
      popupCloseTime: opts.popupCloseTime,
      menuPath,
      deviceId: deviceId || undefined,
      tradeAcco: resolvedExtra && resolvedExtra.tradeAcco !== undefined ? resolvedExtra.tradeAcco : (info && info.userLoginCustomer && info.userLoginCustomer.tradeAcco),
      fofundNo: resolvedExtra && resolvedExtra.fofundNo !== undefined
        ? resolvedExtra.fofundNo
        : (info && info.userLoginCustomer && (info.userLoginCustomer.fofundNo || info.userLoginCustomer.thirdAcco)),
      menuName,
      businessType: resolvedExtra && resolvedExtra.businessType,
      fundCode: resolvedExtra && resolvedExtra.fundCode,
      fundName: resolvedExtra && resolvedExtra.fundName
    }
    if (opts.popupRemark != null && String(opts.popupRemark).trim() !== '') {
      payload.popupRemark = String(opts.popupRemark).trim().slice(0, 512)
    }
    saveTradeConfirmRecord(payload, {}).catch(err => {
      const msg = (err && (err.msg || err.message || err.serverMessage)) || err
      console.warn('[trade-confirm-log]', msg)
    })
  } catch (e) {
    console.warn('[trade-confirm-log]', (e && (e.message || e)) || e)
  }
}

export function getBeneficiaryControlDescription(beneficiaryControlDescription) {
  if (beneficiaryControlDescription) {
    return beneficiaryControlDescription.split(',').map(item => {
      switch (item) {
        case '0':
          return '协议约定形式'
        case '1':
          return '决定法定代表人、董事、监事、高级管理人员的任免'
        case '2':
          return '决定公司重大经营、管理决策的制定或者执行'
        case '3':
          return '决定公司的财务收支'
        case '4':
          return '长期实际支配使用公司重要资产或者主要资金'
        default:
          return ''
      }
    }).join(',')
  }
  return ''
}
