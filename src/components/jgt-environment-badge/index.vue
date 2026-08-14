<template>
  <div v-if="visible" class="intl-environment-badge" role="status">
    {{ $t('mockEnvironmentBadge') }}
  </div>
</template>

<script>
import { isMockMode } from '@/services/intl/mode'

export default {
  name: 'JgtEnvironmentBadge',
  computed: {
    visible () {
      return isMockMode()
    }
  }
}
</script>

<style lang="scss" scoped>
.intl-environment-badge {
  position: fixed;
  z-index: 9999;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  border-radius: 12px;
  color: #7a4a00;
  background: #fff3cd;
  border: 1px solid #f0c36d;
  font-size: 12px;
  pointer-events: none;
}
</style>
