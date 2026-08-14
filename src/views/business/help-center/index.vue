<template>
  <d2-container class="help-shell">
    <template slot="header"><div class="help-page-title">{{ $t('helpTitle') }}</div></template>
    <div class="help-page">
      <header class="help-header">
        <p>{{ $t('helpSubtitle') }}</p>
      </header>

      <el-card class="help-search" shadow="never">
        <el-form :inline="true" @submit.native.prevent="search">
          <el-form-item>
            <el-input
              v-model.trim="filters.keyword"
              clearable
              class="help-keyword"
              prefix-icon="el-icon-search"
              :placeholder="$t('helpSearchPlaceholder')"
              @keyup.enter.native="search"
              @clear="search"
            />
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.type" clearable :placeholder="$t('helpTypeAll')">
              <el-option :label="$t('helpTypeFaq')" value="FAQ" />
              <el-option :label="$t('helpTypeGuide')" value="GUIDE" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.categoryCode" clearable :placeholder="$t('helpCategoryAll')">
              <el-option
                v-for="category in categories"
                :key="category.value"
                :label="$t(category.labelKey)"
                :value="category.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">{{ $t('helpSearch') }}</el-button>
            <el-button @click="clearFilters">{{ $t('helpClear') }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <section class="help-results" v-loading="loading">
        <el-alert
          v-if="loadError"
          type="warning"
          :title="$t('helpErrorLoad')"
          :closable="false"
          show-icon
        />

        <template v-else-if="items.length">
          <el-card
            v-for="item in items"
            :key="item.contentId"
            class="help-item"
            shadow="hover"
          >
            <div class="help-item__main">
              <div class="help-item__meta">
                <el-tag size="mini" type="info">{{ typeLabel(item.type) }}</el-tag>
                <span>{{ categoryLabel(item.categoryCode) }}</span>
              </div>
              <h2>{{ item.title || $t('helpContentUnavailable') }}</h2>
              <p>{{ item.body || $t('helpContentUnavailable') }}</p>
            </div>
            <el-button type="text" @click="viewContent(item)">
              {{ $t('helpViewContent') }}<i class="el-icon-arrow-right el-icon--right" />
            </el-button>
          </el-card>

          <el-pagination
            v-if="total > pageSize"
            class="help-pagination"
            background
            layout="prev, pager, next"
            :current-page="page"
            :page-size="pageSize"
            :total="total"
            @current-change="changePage"
          />
        </template>

        <el-empty v-else-if="!loading" :description="$t('helpNoResults')">
          <el-button type="primary" plain @click="clearFilters">{{ $t('helpClearFilters') }}</el-button>
        </el-empty>
      </section>

      <el-card class="help-contact" shadow="never">
        <div slot="header" class="help-contact__header">
          <i class="el-icon-phone-outline" />
          <span>{{ $t('helpContactTitle') }}</span>
        </div>
        <p class="help-contact__intro">{{ $t('helpContactIntro') }}</p>
        <div v-if="contact" class="help-contact__grid">
          <div>
            <span>{{ $t('helpContactTeam') }}</span>
            <strong>{{ contact.serviceTeam }}</strong>
          </div>
          <div>
            <span>{{ $t('helpContactPhone') }}</span>
            <a :href="'tel:' + contact.phone">{{ contact.phone }}</a>
          </div>
          <div>
            <span>{{ $t('helpContactEmail') }}</span>
            <a :href="'mailto:' + contact.email">{{ contact.email }}</a>
          </div>
          <div>
            <span>{{ $t('helpContactHours') }}</span>
            <strong>{{ contact.serviceHours }}</strong>
          </div>
          <div class="help-contact__address">
            <span>{{ $t('helpContactAddress') }}</span>
            <strong>{{ contact.address }}</strong>
          </div>
        </div>
      </el-card>

      <guide-dialog ref="guideDialog" />
    </div>
  </d2-container>
</template>

<script>
import { help } from '@/services/intl'
import GuideDialog from './GuideDialog'

export default {
  name: 'HelpCenter',
  components: { GuideDialog },
  data () {
    return {
      loading: false,
      loadError: false,
      items: [],
      contact: null,
      total: 0,
      page: 1,
      pageSize: 10,
      filters: {
        keyword: '',
        type: '',
        categoryCode: ''
      },
      categories: [
        { value: 'ACCOUNT', labelKey: 'helpCategoryAccount' },
        { value: 'TRADE', labelKey: 'helpCategoryTrade' },
        { value: 'STATEMENT', labelKey: 'helpCategoryStatement' }
      ]
    }
  },
  watch: {
    '$locale' () {
      this.page = 1
      this.loadContact()
      this.loadContent()
    }
  },
  created () {
    this.loadContact()
    this.loadContent()
  },
  methods: {
    async loadContact () {
      try {
        const content = await help.getContact({ locale: this.$locale })
        this.contact = content && content.contact
      } catch (error) {
        this.contact = null
      }
    },
    async loadContent () {
      this.loading = true
      this.loadError = false
      try {
        const result = await help.list({
          ...this.filters,
          page: this.page,
          pageSize: this.pageSize,
          locale: this.$locale
        })
        this.items = result.items || []
        this.total = result.total || 0
      } catch (error) {
        this.items = []
        this.total = 0
        this.loadError = true
      } finally {
        this.loading = false
      }
    },
    search () {
      this.page = 1
      this.loadContent()
    },
    clearFilters () {
      this.filters.keyword = ''
      this.filters.type = ''
      this.filters.categoryCode = ''
      this.search()
    },
    changePage (page) {
      this.page = page
      this.loadContent()
    },
    async viewContent (item) {
      if (item.type !== 'GUIDE') {
        this.$refs.guideDialog.open(item)
        return
      }
      try {
        const guide = await help.getGuide({ contentId: item.contentId, locale: this.$locale })
        this.$refs.guideDialog.open(guide)
      } catch (error) {
        this.$message.error(this.$t('helpErrorGuide'))
      }
    },
    typeLabel (type) {
      return this.$t(type === 'GUIDE' ? 'helpTypeGuide' : 'helpTypeFaq')
    },
    categoryLabel (categoryCode) {
      const category = this.categories.find(item => item.value === categoryCode)
      return category ? this.$t(category.labelKey) : this.$t('helpCategoryOther')
    }
  }
}
</script>

<style lang="scss" scoped>
.help-page {
  padding: 0 0 32px;
  background: transparent;
}

.help-page-title { min-height: 30px; font-size: 16px; font-weight: 600; line-height: 30px; }

.help-header {
  margin: 0;
  padding: 10px 16px;
  border-bottom: 1px solid;
  @include borderColor(A13);
  background: transparent;

  p {
    margin: 0;
    @include color(A21);
    font-size: 12px;
  }
}

.help-search {
  margin: 0 0 16px;
  border: 0;
  border-bottom: 1px solid;
  @include borderColor(A13);
  border-radius: 0;
  background: transparent;

  ::v-deep .el-card__body {
    padding: 12px 16px 0;
  }

  ::v-deep .el-form-item { margin-right: 10px; margin-bottom: 12px; }
  ::v-deep .el-input__inner { height: 30px; border-radius: 0; line-height: 30px; }
  ::v-deep .el-input__icon { line-height: 30px; }
  ::v-deep .el-button { height: 30px; padding: 7px 16px; border-radius: 0; }

  .help-keyword {
    width: 320px;
  }
}

.help-results {
  min-height: 240px;
  padding: 0 16px;
}

.help-item {
  margin: 0;
  border: 0;
  border-bottom: 1px solid;
  @include borderColor(A13);
  border-radius: 0;

  ::v-deep .el-card__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    min-height: 72px;
    padding: 12px 14px;
  }

  &:hover { @include backgroundColor(A11); }

  h2 {
    margin: 7px 0 4px;
    color: inherit;
    font-size: 14px;
  }

  p {
    display: -webkit-box;
    overflow: hidden;
    margin: 0;
    @include color(A21);
    font-size: 12px;
    line-height: 1.5;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}

.help-item__main {
  min-width: 0;
  flex: 1;
}

.help-item__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  @include color(A21);
  font-size: 12px;
}

.help-pagination {
  margin: 24px 0;
  text-align: right;
}

.help-contact {
  margin: 24px 16px 0;
  border: 1px solid;
  @include borderColor(A13);
  border-top-width: 2px;
  border-radius: 0;
  background: transparent;

  ::v-deep .el-card__header { padding: 10px 14px; @include backgroundColor(A14); }
  ::v-deep .el-card__body { padding: 14px; }
}

.help-contact__header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  font-weight: 600;
}

.help-contact__intro {
  margin: 0 0 18px;
  @include color(A21);
  font-size: 12px;
}

.help-contact__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 36px;

  > div {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  span {
    @include color(A21);
    font-size: 12px;
  }

  strong,
  a {
    color: inherit;
    font-size: 13px;
    font-weight: 500;
  }

  a {
    color: inherit;
  }
}

.help-contact__address {
  grid-column: 1 / -1;
}

@media (max-width: 760px) {
  .help-search .help-keyword { width: 100%; }
  .help-contact__grid { grid-template-columns: 1fr; }
  .help-contact__address { grid-column: 1; }
}
</style>
