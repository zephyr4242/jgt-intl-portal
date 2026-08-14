<template>
  <label class="jgt-lang-switch" :class="[`is-${theme}`]" :title="$t('langLabel')">
    <span v-if="showLabel" class="jgt-lang-switch__label">{{ $t('langLabel') }}</span>
    <select
      class="jgt-lang-switch__select"
      :value="locale"
      @change="onChange"
    >
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
  </label>
</template>

<script>
import { LANG_OPTIONS } from '@/locales'
import { mapState } from 'vuex'

export default {
  name: 'JgtLangSwitch',
  props: {
    /** dark: 登录深色卡；light: 顶栏浅色 */
    theme: {
      type: String,
      default: 'light',
      validator: v => ['light', 'dark'].includes(v)
    },
    showLabel: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      options: LANG_OPTIONS
    }
  },
  computed: {
    ...mapState('d2admin/locale', {
      locale: state => state.locale
    })
  },
  methods: {
    onChange (e) {
      const next = e.target.value
      this.$store.dispatch('d2admin/locale/set', next)
      this.$emit('change', next)
    }
  }
}
</script>

<style lang="scss" scoped>
.jgt-lang-switch {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0;
}

.jgt-lang-switch__label {
  font-size: 12px;
  white-space: nowrap;
}

.jgt-lang-switch__select {
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  outline: none;
}

.is-dark {
  .jgt-lang-switch__label {
    color: rgba(255, 255, 255, 0.75);
  }

  .jgt-lang-switch__select {
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #fff;
  }
}

.is-light {
  .jgt-lang-switch__label {
    color: #aaa6a0;
  }

  .jgt-lang-switch__select {
    background: #242426;
    border: 1px solid #4b4b4f;
    color: #d1ad78;
  }
}
</style>
