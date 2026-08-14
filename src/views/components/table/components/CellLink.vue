<template>
  <div v-bind="$attrs">
    <div v-if="text2">
      <!-- 双行 -->
      <div>
        <div v-if="url1" @click="click(url1,text1)" class="celllink">
          {{ text1 }}
        </div>
        <div v-else>{{ text1 }}</div>
      </div>
      <div>
        <div v-if="url2" @click="click(url2,text2)" class="celllink">
          {{ text2 }}
        </div>
        <div v-else>{{ text2 }}</div>
      </div>
    </div>
    <div v-else>
      <!-- 单行 带连接 -->
      <div v-if="url1" @click="click(url1,text1, fileId1)" class="celllink">
        {{ text1 }}
      </div>
      <!-- 单行 不带链接 -->
      <div v-else>{{ text1 }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CellLink',
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  watch: {
    prop () {
      this.init()
    }
  },
  data () {
    return {
      text1: null,
      url1: null,
      text2: null,
      url2: null,
      fileId1: null
    }
  },
  computed: {},
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const data = this.prop?.row ?? {}
      // 第一行
      const text1 = this.prop?.column?.text1
      this.text1 = text1 ? data[text1] : ''
      const url1 = this.prop?.column?.url1
      this.url1 = url1 ? data[url1] : ''
      const fileId1 = this.prop?.column?.fileId1
      this.fileId1 = fileId1 ? data[fileId1] : ''
      // 第二行
      const text2 = this.prop?.column?.text2
      this.text2 = text2 ? data[text2] : ''
      const url2 = this.prop?.column?.url2
      this.url2 = url2 ? data[url2] : ''
    },
    click (url, title, fileId) {
      if (this.prop?.column.pdfOpen && this.$route.path.includes('help/center')) {
        this.util.filePreview({
          type: 'url',
          // fileName: title,
          fileId: url
        })
      } else {
        window.open(url, '_blank')
      }
    }
  }
}
</script>
<style scoped lang="scss">
.celllink {
  @include color(A10);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
}
</style>
