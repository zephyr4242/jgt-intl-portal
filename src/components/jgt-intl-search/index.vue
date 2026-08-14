<template>
  <div class="intl-search" @keydown.enter.prevent="goSearch">
    <i class="el-icon-search intl-search__ico" />
    <input
      v-model.trim="keyword"
      class="intl-search__input"
      type="text"
      :placeholder="$t('topSearchPlaceholder')"
      @focus="open = true"
      @blur="onBlur"
    >
    <div v-if="open && keyword" class="intl-search__panel">
      <div
        v-for="item in matched"
        :key="item.id"
        class="intl-search__item"
        @mousedown.prevent="selectFund(item)"
      >
        <span class="intl-search__code">{{ item.fundCode }}</span>
        <span class="intl-search__name">{{ localized(item.name) }}</span>
      </div>
      <div v-if="!matched.length" class="intl-search__empty">{{ $t('topSearchEmpty') }}</div>
    </div>
  </div>
</template>

<script>
import { products } from '@/services/intl'

export default {
  name: 'JgtIntlSearch',
  data () {
    return {
      keyword: '',
      open: false,
      funds: []
    }
  },
  computed: {
    matched () {
      const kw = (this.keyword || '').toLowerCase()
      if (!kw) return []
      return this.funds
        .filter(f => {
          const hay = `${f.fundCode} ${Object.values(f.name || {}).join(' ')} ${Object.values(f.managerName || {}).join(' ')}`.toLowerCase()
          return hay.includes(kw)
        })
        .slice(0, 8)
    }
  },
  watch: {
    '$locale' () {
      this.loadFunds()
    }
  },
  created () {
    this.loadFunds()
  },
  methods: {
    async loadFunds () {
      try {
        const result = await products.list({ page: 1, pageSize: 100, locale: this.$locale })
        this.funds = result.items
      } catch (e) {
        this.funds = []
      }
    },
    localized (value) {
      return value && typeof value === 'object' ? (value[this.$locale] || '') : (value || '')
    },
    onBlur () {
      setTimeout(() => {
        this.open = false
      }, 120)
    },
    goSearch () {
      this.$router.push({
        path: '/fund/product/list',
        query: this.keyword ? { q: this.keyword } : {}
      })
      this.open = false
    },
    selectFund (item) {
      this.keyword = this.localized(item.name)
      this.open = false
      this.$router.push({ path: '/fund/product/list', query: { q: item.fundCode } })
    }
  }
}
</script>

<style lang="scss" scoped>
.intl-search {
  position: relative;
  width: 100%;
  max-width: 420px;
  height: 34px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  background: #202022;
  border: 1px solid #4b4b4f;
  border-radius: 2px;
  box-sizing: border-box;
}

.intl-search__ico {
  color: #a99576;
  font-size: 14px;
}

.intl-search__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: #dedbd6;
  min-width: 0;

  &::placeholder {
    color: #777579;
  }
}

.intl-search__panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #29292b;
  border: 1px solid #4b4b4f;
  border-radius: 2px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.36);
  max-height: 280px;
  overflow: auto;
  z-index: 20;
}

.intl-search__item {
  display: flex;
  gap: 10px;
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #3a3733;
  }
}

.intl-search__code {
  color: #d1ad78;
  font-family: monospace;
  min-width: 52px;
}

.intl-search__name {
  color: #d0cdc8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.intl-search__empty {
  padding: 12px;
  font-size: 12px;
  color: #8f8d8a;
  text-align: center;
}
</style>
