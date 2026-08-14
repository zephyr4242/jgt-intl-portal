<template>
  <d2-container class="biz-shell">
    <div class="biz-page">
      <h1 class="biz-title">{{ $t('navAccount') }}</h1>
      <p class="biz-sub">{{ $t('accountSub') }}</p>

      <div class="biz-tip biz-tip--top">
        <span>ℹ️</span>
        <span>{{ $t('accountFlowTip') }}</span>
      </div>

      <div class="account-grid">
        <div class="biz-card">
          <div class="biz-card__hd">{{ $t('accountDocsTitle') }}</div>
          <el-table
            :data="docs"
            stripe
            size="small"
            class="biz-table"
            style="width: 100%"
          >
            <el-table-column type="index" label="#" width="56" />
            <el-table-column prop="title" :label="$t('accountDocName')" min-width="180">
              <template slot-scope="{ row }">
                <span class="doc-name">{{ row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="desc" :label="$t('accountDocDesc')" min-width="200" />
          </el-table>
        </div>

        <div class="account-side">
          <div class="biz-card">
            <div class="biz-card__hd">{{ $t('accountContactTitle') }}</div>
            <div class="contact-bd">
              <div class="contact-row">
                <div class="contact-lbl">{{ $t('accountDept') }}</div>
                <div class="contact-val"><strong>{{ contact.manager }}</strong></div>
              </div>
              <div class="contact-row">
                <div class="contact-lbl">{{ $t('accountPhone') }}</div>
                <div class="contact-val contact-phone">{{ contact.phone }}</div>
              </div>
              <div class="contact-row">
                <div class="contact-lbl">{{ $t('accountEmail') }}</div>
                <div class="contact-val">{{ contact.email }}</div>
              </div>
              <div class="contact-row">
                <div class="contact-lbl">{{ $t('accountAddress') }}</div>
                <div class="contact-val">{{ contact.address }}</div>
              </div>
              <div class="contact-row">
                <div class="contact-lbl">{{ $t('accountHours') }}</div>
                <div class="contact-val">{{ contact.hours }}</div>
              </div>
            </div>
          </div>

          <div class="biz-card">
            <div class="biz-card__hd">{{ $t('accountStepsTitle') }}</div>
            <ol class="account-steps">
              <li v-for="(step, idx) in steps" :key="idx">{{ step }}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </d2-container>
</template>

<script>
import { getAccountDocs, getContactInfo } from '@/libs/demo-biz-data'

export default {
  name: 'accountGuide',
  computed: {
    docs () {
      return getAccountDocs(this.$locale)
    },
    contact () {
      return getContactInfo(this.$locale)
    },
    steps () {
      // eslint-disable-next-line no-unused-expressions
      this.$locale
      return [
        this.$t('accountStep1'),
        this.$t('accountStep2'),
        this.$t('accountStep3'),
        this.$t('accountStep4'),
        this.$t('accountStep5'),
        this.$t('accountStep6')
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/biz-page.scss';

.biz-tip--top {
  margin-top: 0;
  margin-bottom: 20px;
}

.account-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 20px;
  align-items: start;
}

.account-side {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.doc-name {
  font-weight: 500;
  color: #1a2d4a;
}

.contact-bd {
  padding: 8px 20px 20px;
}

.contact-row {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.contact-lbl {
  color: #999;
  font-size: 13px;
  margin-bottom: 4px;
}

.contact-val {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}

.contact-phone {
  font-size: 18px;
  font-weight: 700;
  color: #c41e3a;
}

.account-steps {
  margin: 0;
  padding: 8px 20px 20px 36px;
  font-size: 14px;
  line-height: 2;
  color: #666;
}

@media (max-width: 960px) {
  .account-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<style lang="scss">
@import '../styles/biz-table.scss';
</style>
