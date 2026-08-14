<template>
  <el-select
    id="jgt-search"
    size="small"
    v-model="id"
    filterable
    remote
    placeholder="搜索产品及公司"
    no-data-text="暂无搜索结果，请输入更多信息进行搜索"
    no-match-text="暂无搜索结果，请输入更多信息进行搜索"
    loading-text="搜索中..."
    class="jgt-search"
    popper-class="jgt-search-popper"
    ref="select"
    :remote-method="remoteMethod"
    :loading="loading"
    @change="selectChanged"
    @visible-change="visibleChanged"
  >
    <template slot="prefix">
      <span class="iconfont-sousuo jgt-search-icon"></span>
    </template>
    <el-option
      disabled
      v-if="showHis"
      value="history"
      class="points-event-none"
    >
      <span class="jgt-search__warning">历史搜索</span>
    </el-option>
    <el-option
      disabled
      v-if="options.length === 0"
      value="nodata"
      class="points-event-none"
    >
      <span class="jgt-search__warning">
        暂无搜索结果，请输入更多信息进行搜索
      </span>
    </el-option>
    <!-- 固定期限型item.code没有值，不能作为key -->
    <!-- 为了方便，这里value用全量item -->
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :label="item.recordName"
      :value="item"
    >
      <!-- 基金公司 -->
      <div v-if="item.isCompany" class="jgt-search-option">
        <span
          :class="{ recent: item.recent }"
          class="jgt-search-option--company"
        >
          <span v-html="highLightHtml(item.recordName)"></span>
        </span>
        <span class="jgt-search-option--companyType">
          （{{ typeHash[item.prodType] }}）
        </span>
      </div>
      <!-- 基金产品 -->
      <div v-else class="jgt-search-option">
        <span
          :class="{ recent: item.recent }"
          class="jgt-search-option--product"
        >
          <span class="jgt-search-option--code">
            <span v-html="highLightHtml(item.recordCode)"></span>
          </span>
          <span>
            <span v-html="highLightHtml(item.recordName)"></span>
          </span>
        </span>
        <span class="jgt-search-option--productType">
           （{{ typeHash[item.prodType] }}）
        </span>
      </div>
    </el-option>
  </el-select>
</template>

<script>
import {
  searchGetHisRcmd,
  searchProduct,
  searchAddHis
} from '@/api/intl/legacy/bus-jgt-prd'
import { mapState } from 'vuex'

export default {
  name: 'jgt-search',
  computed: {
    ...mapState('d2admin/user', ['info'])
  },
  data () {
    return {
      id: null, // 选中的id
      keyword: '', // 搜索词
      options: [], // 下拉选项
      loading: false,
      showHis: false, // 是否显示 “历史搜索”,
      typeHash: {
        '1': '公募',
        '2': '资管',
        '3': '私募'
      }
    }
  },
  methods: {
    // 根据关键词搜索
    search () {
      try {
        this.loading = true
        if (this.util.isEmpty(this.keyword)) {
          // 未输入关键词时，查历史搜索及推荐
          this.searchHis()
        } else {
          // 根据关键词搜索
          this.searchKeyword()
        }
      } catch (error) {
      } finally {
        this.loading = false
      }
    },
    // 处理关键词
    remoteMethod (keyword) {
      keyword = keyword.trim()
      this.keyword = keyword
      this.search()
    },
    // 查询历史搜索
    async searchHis () {
      this.showHis = true
      const params = {
        optCode: this.info.userLoginCustomer?.operatorCode || this.info?.mobile
      }

      if (!params.optCode) return

      const data = await searchGetHisRcmd(params)
      // 这个搜索结果对前端不友好，过滤合并一下
      let options = []
      if (data?.rec?.slice) {
        // 取前3个历史
        let top3Recent = data.rec.slice(0, 3)
        // 增加一个前端标识来自推荐，用于样式处理
        top3Recent.forEach(i => {
          i.recent = true
        })
        options = top3Recent
      }

      // 推荐全弄进去
      if (data?.rcmd?.length > 0) {
        options = options.concat(data.rcmd)
      }

      // 最多显示60条数据
      options = options.slice(0, 60)

      options.forEach(item => {
        // 添加是否为公司的标识
        item.isCompany = item.recordType === '2'
      })

      this.options = options
      this.hoverFirst()
    },
    // 根据关键词搜索
    async searchKeyword () {
      try {
        this.showHis = false
        const params = {
          searchKeyword: this.keyword
        }
        let options = await searchProduct(params)
        options.forEach(item => {
          // 添加是否为公司的标识
          item.isCompany = item.recordType === '2'
        })
        this.options = options

        this.hoverFirst()
      } catch (error) {
        this.options = []
      }
    },
    hoverFirst () {
      // 自动悬停到第一个可点击选项上
      const options = this.$refs?.select?.options
      if (!options || options.length === 0) {
        return
      }

      const index = options.findIndex(
        i => !['nodata', 'history'].includes(i.value)
      )

      if (index >= 0) {
        this.$nextTick(() => {
          this.$refs.select.hoverIndex = index
        })
      }
    },
    async addSearch (param) {
      try {
        const params = {
          optCode:
            this.info.userLoginCustomer?.operatorCode || this.info?.mobile,
          // platform: this.$isElectron ? 'client' : 'Web',
          recordCode: param.recordCode,
          recordName: param.recordName,
          recordType: param.recordType,
          prodType: param.prodType
        }
        await searchAddHis(params)
      } catch (error) {}
    },
    // 标红搜索词，这部分样式不用依赖后端了
    highLightHtml (word) {
      if (this.util.isEmpty(this.keyword)) {
        return word
      } else {
        try {
          const transformKeyWord = this.util.stringToReg(this.keyword)
          const reg = new RegExp(transformKeyWord, 'gi')
          const highlightText = `<span class="highlight-text">${this.keyword}</span>`
          return word.replace(reg, highlightText)
        } catch (e) {
          return word
        }
      }
    },
    // 跳转事件
    selectChanged (item) {
      // 跳转后失去焦点
      setTimeout(() => {
        this.$refs.select.blur()
      }, 0)
      if (item.prodType === '3') { // 私募
        if (item.isCompany) {
          // 公司类
          const url = `/private/company/detail/${item.recordCode}`
          const options = {
            url: url,
            push: true
          }
          this.searchResultClick(item)
          this.util.fapRouter(options)
          this.addSearch(item)
          return false
        }
        const url = `/private/product/detail/${item.recordCode}`
        const options = {
          url: url,
          push: true
        }
        this.searchResultClick(item)
        this.util.fapRouter(options)
      } else {
        if (item.isCompany) {
          // 公司类
          if (item.prodType === '1') {
            // 公募
            // 基金公司详情
            const url = `/fund/company/detail/${item.recordCode}`
            const options = {
              url: url,
              push: true
            }
            this.searchResultClick(item)
            this.util.fapRouter(options)
          } else if (item.prodType === '2') {
            // 资管
            const url = `/bmis/company/detail/${item.recordCode}`
            const options = {
              url: url,
              push: true
            }
            this.searchResultClick(item)
            this.util.fapRouter(options)
          }
        } else {
          // 产品类
          let url = ''
          if (item.prodType === '1') {
            // 公募
            url = `/fund/product/detail/${item.recordCode}`
          } else if (item.prodType === '2') {
            // 资管
            url = `/bmis/product/detail/${item.recordCode}`
          }

          const options = {
            url: url,
            tab: item.recordName,
            menu: 'JIJINCHANPIN',
            push: true
          }
          this.searchResultClick(item)
          this.util.fapRouter(options)
        }
      }

      this.addSearch(item)
    },
    searchResultClick (item) {
      try {
        if (this.showHis) {
          let searchHis = {}
          let index = this.options.findIndex(row => {
            return row.recordName === item.recordName
          })
          if (item.isCompany) {
            searchHis = {
              result_type: '基金公司',
              result_position: index + 1,
              fund_company_name: item.recordName
            }
          } else {
            searchHis = {
              result_type: '基金产品',
              result_position: index + 1,
              fund_code: item.recordCode,
              fund_name: item.recordName
            }
          }
          this.$jgtSensorsTrack.historySearchResultClick(searchHis)
        } else {
          let searchData = {}
          if (item.isCompany) {
            searchData = {
              result_type: '基金公司',
              fund_company_name: item.recordName
            }
          } else {
            searchData = {
              key_word: this.keyword,
              result_type: '基金产品',
              fund_code: item.recordCode,
              fund_name: item.recordName
            }
          }
          this.$jgtSensorsTrack.searchResultClick(searchData)
        }
      } catch (error) {

      }
    },
    visibleChanged (val) {
      if (val) {
        // 下拉框显示时
        this.search()
      } else {
        this.id = null
        this.keyword = ''
        this.options = []
      }
    }
  },
  mounted () {
    this.search()
  }
}
</script>

<style lang="scss">
.jgt-search {
  box-sizing: border-box;
  width: 300px;
  position: relative;
  .el-input--prefix input.el-input__inner {
    padding: 0 20px 0 8px;
    height: 28px;
    line-height: 28px;
  }
  .jgt-search-icon {
    line-height: 28px;
  }
  span.el-input__prefix {
    right: -272px;
    pointer-events: none;
  }

  span.el-input__suffix{
    display: none;
  }
}

.jgt-search__warning {
  @include color(A20);
  font-size: 12px;
}

.jgt-search-option {
  display: flex;
  justify-content: space-between;
  @include color(A6);
  font-weight: 400;
  // 最近记录全红
  .recent {
    @include color(A3);
  }

  .jgt-search-option--code {
    margin-right: 12px;
  }
  .jgt-search-option--company {
    width: 244px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .jgt-search-option--product {
    //width: 284px;
    width: 244px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .jgt-search-option--companyType {
    @include color(A23);
  }
  .jgt-search-option--productType {
    @include color(A18);
  }

  .highlight-text {
    @include color(A18);
  }
  .el-select-dropdown__item{
    padding: 0 8px;
  }
}

.jgt-search-popper {
  &.el-select-dropdown {
    width: 300px;
  }
  div.el-select-dropdown__wrap {
    max-height: 480px;
  }
  li.el-select-dropdown__item {
    padding: 0 8px;
  }
}
</style>
