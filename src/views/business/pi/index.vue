<template>
  <d2-container>
    <div class="pi-wrap" v-loading="loading">
      <div class="pi-col">
        <h1 class="pi-title">{{ $t('navPI') }}</h1>
        <p class="pi-sub">{{ $t('piSub') }}</p>

        <div v-if="isPI" class="pi-done">
          <div class="pi-done__badge">{{ $t('wbPiCertified') }}</div>
          <p>{{ $t('piAlreadyDone') }}</p>
          <el-button type="primary" @click="$router.push('/fund/product/list')">{{ $t('navProducts') }}</el-button>
        </div>

        <template v-else>
          <div class="pi-alert">
            <span>⚠️</span>
            <span>{{ $t('piWarn') }}</span>
          </div>
          <div class="pi-card">
            <div class="pi-card__hd">{{ $t('piDeclareTitle') }}</div>
            <div class="pi-card__bd">
              <label v-for="(item, idx) in piItems" :key="idx" class="pi-check">
                <input v-model="checks[idx]" type="checkbox">
                <span>{{ item }}</span>
              </label>
              <el-button
                type="primary"
                class="pi-submit"
                :disabled="!allChecked"
                :loading="submitting"
                @click="confirmPI"
              >
                {{ $t('piConfirmBtn') }}
              </el-button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </d2-container>
</template>

<script>
import { mapState } from 'vuex'
import { fetchPiStatus, confirmPiStatus } from '@/libs/intl-biz'

export default {
  name: 'pi',
  data () {
    return {
      loading: false,
      submitting: false,
      isPI: false,
      checks: [false, false, false, false]
    }
  },
  computed: {
    ...mapState('d2admin/user', {
      userInfo: state => state.info || {}
    }),
    piItems () {
      // eslint-disable-next-line no-unused-expressions
      this.$locale
      return [
        this.$t('piItem1'),
        this.$t('piItem2'),
        this.$t('piItem3'),
        this.$t('piItem4')
      ]
    },
    allChecked () {
      return this.checks.every(Boolean)
    }
  },
  created () {
    this.loadStatus()
  },
  methods: {
    async loadStatus () {
      this.loading = true
      try {
        const status = await fetchPiStatus()
        this.isPI = !!status.pi
        if (this.isPI) {
          await this.persistPiToStore(true)
        }
      } catch (e) {
        this.isPI = false
      } finally {
        this.loading = false
      }
    },
    async persistPiToStore (pi) {
      const next = {
        ...this.userInfo,
        pi: !!pi,
        piFlag: pi ? '1' : '0'
      }
      try {
        await this.$store.dispatch('d2admin/user/set', next)
      } catch (e) { /* ignore */ }
    },
    async confirmPI () {
      if (!this.allChecked) return
      this.submitting = true
      try {
        const items = this.piItems
        const status = await confirmPiStatus({
          locale: this.$locale || 'zh-Hans',
          item1Text: items[0],
          item2Text: items[1],
          item3Text: items[2],
          item4Text: items[3]
        })
        this.isPI = !!status.pi
        await this.persistPiToStore(this.isPI)
        this.$message.success(this.$t('piSuccess'))
        this.$router.push('/fund/product/list')
      } catch (e) {
        // axios 已处理
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-wrap {
  display: flex;
  justify-content: center;
  padding: 24px 16px 48px;
  box-sizing: border-box;
}

.pi-col {
  width: 100%;
  max-width: 680px;
}

.pi-title {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: #1a2d4a;
}

.pi-sub {
  margin: 0 0 20px;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.pi-alert {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  color: #d48806;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
}

.pi-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.pi-card__hd {
  padding: 14px 20px;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 600;
  color: #1a2d4a;
}

.pi-card__bd {
  padding: 20px;
}

.pi-check {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  cursor: pointer;

  input {
    margin-top: 4px;
    flex-shrink: 0;
  }
}

.pi-submit {
  margin-top: 12px;
}

.pi-done {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.pi-done__badge {
  display: inline-block;
  margin-bottom: 12px;
  padding: 4px 10px;
  background: #e6f7e6;
  color: #389e0d;
  border-radius: 2px;
  font-size: 13px;
  font-weight: 600;
}
</style>
