<template>
  <div>
    <div v-if="!isShow">
      <div class="multiLineBox ">
        <div class="multiLineBox-main">
          <jy-tooltip effect="dark" v-if="row[column['prop']]" :content="row[column['prop']] | nvl('--') | document" placement="bottom">
            <div :class="util.isEmpty(row[column['prop']]) ? 'margin-l-5' : 'multiLineSpan1'"
              @click="openUrl(expendItem['url'], expendItem['fileId'])">
              {{ row[column['prop']] | nvl('--') | document }}
            </div>
          </jy-tooltip>
          <jy-tooltip effect="dark"  v-if="row[column['prop3']]"  :content="row[column['prop3']] | nvl('--') | document" placement="bottom">
            <div :class="util.isEmpty(row[column['prop3']]) ? 'margin-l-5' : 'multiLineSpan1'"
              @click="openUrl(expendItem['url3'], expendItem['fileId3'])">
              {{ row[column['prop3']] | nvl('--') | document }}
            </div>
          </jy-tooltip>
        </div>
        <div v-show="!row[column['prop1']] && util.notEmpty(expendItem['remark']) && row[expendItem['remark']]" class="multiLineSpan2 margin-l-5">
          {{ expendItem['doc'] + row[expendItem['remark']] }}</div>
      </div>
      <div class="multiLineBox " v-if="(column['prop1'] || column['prop4'] ) && (row[column['prop1']] || row[column['prop4']])">
        <div class="multiLineBox-main">
          <jy-tooltip effect="dark" v-if="row[column['prop1']]" :content="row[column['prop1']] | nvl('--') | document" placement="bottom">
            <div :class="util.isEmpty(row[column['prop1']]) ? 'margin-l-5' : 'multiLineSpan1'"
              @click="openUrl(expendItem['url1'], expendItem['fileId1'])">
              {{ row[column['prop1']] | nvl('--') | document }}
            </div>
          </jy-tooltip>
          <jy-tooltip effect="dark" v-if="row[column['prop4']]"  :content="row[column['prop4']] | nvl('--') | document" placement="bottom">
            <div :class="util.isEmpty(row[column['prop4']]) ? 'margin-l-5' : 'multiLineSpan1'"
              @click="openUrl(expendItem['url4'], expendItem['fileId4'])">
              {{ row[column['prop4']] | nvl('--') | document }}
            </div>
          </jy-tooltip>
        </div>
        <div v-show="util.notEmpty(expendItem['remark']) && row[expendItem['remark']]" class="multiLineSpan2 margin-l-5">
          {{ expendItem['doc'] + row[expendItem['remark']] }}</div>
      </div>
      <div class="multiLineBox" v-if="(column['prop2'] || column['prop5']) && (row[column['prop2']] || row[column['prop5']])">
        <div class="multiLineBox-main">
          <jy-tooltip effect="dark" v-if="row[column['prop2']]" :content="row[column['prop2']] | nvl('--') | document" placement="bottom">
            <div :class="util.isEmpty(row[column['prop2']]) ? 'margin-l-5' : 'multiLineSpan1'"
              @click="openUrl(expendItem['url2'], expendItem['fileId2'])">
              {{ row[column['prop2']] | nvl('--') | document }}
            </div>
          </jy-tooltip>
          <jy-tooltip effect="dark" v-if="row[column['prop5']]" :content="row[column['prop5']] | nvl('--') | document" placement="bottom">
            <div :class="util.isEmpty(row[column['prop5']]) ? 'margin-l-5' : 'multiLineSpan1'"
              @click="openUrl(expendItem['url5'], expendItem['fileId5'])">
              {{ row[column['prop5']] | nvl('--') | document }}
            </div>
          </jy-tooltip>
        </div>
        <div v-show="util.notEmpty(expendItem['remark']) && row[expendItem['remark']]" class="multiLineSpan2 margin-l-5">
          {{ expendItem['doc'] + row[expendItem['remark']] }}</div>
      </div>
    </div>
    <div v-else>--</div>
  </div>
</template>
<script>
import './common.scss'
export default {
  name: 'productInfo',
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      row: {},
      column: {},
      expendItem: {
        // url
        url: '',
        fileId: '',
        // 固定文案
        doc: '',
        // 动态值
        remark: ''
      },
      remarkValue: '',
      linkPath: process.env.NODE_ENV === 'production' ? window.CONFIG.VUE_APP_LINK_PATH : process.env.VUE_APP_LINK_PATH
    }
  },
  computed: {
    isShow() {
      return !this.row[this.column['prop']] && !this.row[this.column['prop1']] && !this.row[this.column['prop2']] && !this.row[this.column['prop3']] && !this.row[this.column['prop4']] && !this.row[this.column['prop5']]
    }
  },
  watch: {
    prop() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.row = this.prop.row
      this.column = this.prop.column
      if (this.util.notEmpty(this.column.expendItem)) this.expendItem = this.column.expendItem
    },
    // 打开pdf
    openUrl(keyValue, keyId) {
      if (keyId && this.util.notEmpty(this.row[keyId])) {
        this.util.preview.minio(this.row[keyId], 'current')
        // 有id时，用minio，获取盖章后文件
      } else if (keyValue && this.util.notEmpty(this.row[keyValue])) {
        this.util.preview.url(this.row[keyValue], 'current')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.margin-l-5 {
  margin-left: 5px;
}
.multiLineBox-main{
  display: flex;
}
</style>
