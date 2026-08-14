<template>
  <d2-container class="biz-shell">
    <div class="biz-page" v-loading="loading">
      <h1 class="biz-title">{{ $t('navReports') }}</h1>
      <p class="biz-sub">{{ $t('postSub') }}</p>

      <div class="biz-stats">
        <div class="biz-stat">
          <div class="biz-stat__lbl">{{ $t('postStatDividend') }}</div>
          <div class="biz-stat__val">{{ dividendCount }}</div>
        </div>
        <div class="biz-stat">
          <div class="biz-stat__lbl">{{ $t('postStatReport') }}</div>
          <div class="biz-stat__val is-danger">{{ reportCount }}</div>
        </div>
        <div class="biz-stat">
          <div class="biz-stat__lbl">{{ $t('postStatMeeting') }}</div>
          <div class="biz-stat__val">{{ meetingCount }}</div>
        </div>
      </div>

      <div class="biz-card">
        <div class="biz-card__hd">{{ $t('postListTitle') }}</div>
        <div
          v-for="item in items"
          :key="item.id"
          class="post-item"
        >
          <div class="post-item__ico">{{ iconOf(item) }}</div>
          <div class="post-item__body">
            <div class="post-item__tags">
              <span class="tag tag-info">{{ item.type }}</span>
              <span class="tag" :class="statusClass(item)">{{ item.status }}</span>
            </div>
            <div class="post-item__fund">{{ item.fundName }}</div>
            <div class="post-item__content">{{ item.content }}</div>
            <div class="post-item__date">{{ $t('postDatePrefix') }}{{ item.date }}</div>
          </div>
          <el-button
            v-if="item.statusCode === '2'"
            class="post-join-btn"
            plain
            size="small"
            :loading="confirmingId === item.id"
            @click="confirmJoin(item)"
          >
            {{ $t('postConfirmJoin') }}
          </el-button>
        </div>
      </div>

      <div class="biz-tip">
        <span>ℹ️</span>
        <span>{{ $t('postTip') }}</span>
      </div>
    </div>
  </d2-container>
</template>

<script>
import { fetchPostInvest, confirmPostItem } from '@/libs/intl-biz'

export default {
  name: 'reports',
  data () {
    return {
      loading: false,
      items: [],
      confirmingId: null
    }
  },
  computed: {
    dividendCount () {
      return this.items.filter(p => /分红|分紅|Dividend/i.test(p.type)).length
    },
    reportCount () {
      return this.items.filter(p => /报告|報告|Report/i.test(p.type)).length
    },
    meetingCount () {
      return this.items.filter(p => /大会|大會|Meeting/i.test(p.type)).length
    }
  },
  watch: {
    '$locale' () {
      this.load()
    }
  },
  created () {
    this.load()
  },
  activated () {
    this.load()
  },
  methods: {
    async load () {
      this.loading = true
      try {
        this.items = await fetchPostInvest(this.$locale)
      } catch (e) {
        this.items = []
      } finally {
        this.loading = false
      }
    },
    iconOf (item) {
      const t = item.type || ''
      if (/分红|分紅|Dividend/i.test(t)) return '💰'
      if (/报告|報告|Report/i.test(t)) return '📄'
      if (/大会|大會|Meeting/i.test(t)) return '🗳️'
      return '📋'
    },
    statusClass (item) {
      if (item.statusCode === '2') return 'tag-pending'
      if (item.statusCode === '0' || item.statusCode === '1' || item.statusCode === '3') return 'tag-ok'
      return 'tag-info'
    },
    async confirmJoin (item) {
      this.confirmingId = item.id
      try {
        await confirmPostItem(item, this.$locale)
        this.$message.success(this.$t('postConfirmOk'))
        await this.load()
      } catch (e) {
        // axios 已处理
      } finally {
        this.confirmingId = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/biz-page.scss';

.post-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 18px 20px;
  border-bottom: 1px solid #e8e8e8;

  &:last-child {
    border-bottom: none;
  }
}

.post-item__ico {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  background: #fdf2f4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.post-item__body {
  flex: 1;
  min-width: 0;
}

.post-item__tags {
  margin-bottom: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.post-item__fund {
  font-weight: 600;
  color: #1a2d4a;
  margin-bottom: 6px;
  font-size: 15px;
}

.post-item__content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.post-item__date {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}

.post-join-btn {
  flex-shrink: 0;
  color: #c41e3a !important;
  border-color: #c41e3a !important;
  background: #fff !important;

  &:hover {
    background: #fdf2f4 !important;
  }
}
</style>

<style lang="scss">
@import '../styles/biz-table.scss';
</style>
