<template>
  <div class="select-box" :style="{ width: defaultWidth }">
    <el-select
      remote
      size="small"
      v-if="transferData.length > 1"
      v-model="selectValue"
      :popper-append-to-body="false"
      @change="handleChange"
      :filterable="filterable"
      :placeholder="selectPlaceholder"
      :disabled="disabled"
      class="text-ellipsis"
      :class="{ 'text-ellipsis-box': textEllipsisBox && checkedLegNum}"
    >
      <el-option
        style="width:100%"
        v-for="item in transferData"
        :key="item.id"
        :label="item.label"
        :value="item.id"
        :title="item.label"
      >
      </el-option>
    </el-select>
    <span class="multiple-box" v-show="textEllipsisBox && checkedLegNum">
      已选{{ checkedLegNum }}
    </span>
    <i
      v-if="transferData.length > 1"
      class="icon jgt-iconfont select-box-icon iconfont-xialafuxuan"
      @click="visible = true"
    ></i>
    <span class="val-box"  :style="{width: defaultWidth}" :title="selectValue" v-else>{{ selectValue }}</span>

    <el-dialog
      :title="dialogTitle"
      width="1000px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="visible"
      :before-close="close"
      :destroy-on-close="true"
      class="fap user-dialog-main"
    >
      <div class="jy-transfer">
        <div class="jy-transfer-left">
          <div class="jy-transfer-left-title">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="selectAll"
              >全选</el-checkbox
            >
            <el-input
              placeholder="请搜索基煜账户"
              clearable
              v-model="searchText"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div
            class="jy-transfer-left-main"
          >
           <div
            :style="`height:${viewH}px;overflow-y:scroll;width:480px;overflow-x:hidden;`"
              ref="hanldeScrollBox"
              @scroll="hanldeScroll">
              <div :style="{height:scorllH}">
                <div :style="`transform:translateY(${offSetY}px); `">
                  <el-checkbox-group v-model="checkList" @change="checkedChange" >
                    <div v-for="item in (isSearch ? searchListData : listData)" :key="item.id+item.label">
                      <el-checkbox
                        v-if="item.id !== 'qita' && item.id !== 'changyong'"
                        :label="item.id"
                        :title="item.label"
                        :key="item.id"
                      >
                        {{ item.label }}
                      </el-checkbox>
                      <el-checkbox
                        v-else-if="item.label === '全部账户'"
                        :label="item.id"
                        :title="item.label"
                        :class=" {'hideAllRef': item.id === 'qita' || item.id === 'changyong'}"
                        :disabled="item.id === 'qita' || item.id === 'changyong'"
                        :key="item.id"
                      >
                        {{ item.label }}
                      </el-checkbox>
                      <el-switch
                        v-else-if="item.id === 'changyong'"
                        v-model="commonCheckAll"
                        class="hideRef"
                        @change="(val) => switchChange(val, item.label)"
                        :active-text="item.label"
                        >
                      </el-switch>
                      <el-switch
                        v-else-if="item.id === 'qita'"
                        v-model="otherCheckAll"
                        class="hideRef"
                        @change="(val) => switchJgtChange(val, item.label)"
                        :active-text="item.label"
                        >
                      </el-switch>
                    </div>
                  </el-checkbox-group>
                </div>
            </div>
           </div>
          </div>
        </div>
        <!-- 已选列表 -->

        <div class="jy-transfer-right" >
          <h4 class="check-box-title jy-transfer-left-title">
            已选账户 <span v-if="jyCheckedOptions.length">（{{jyCheckedOptions.length}}）</span>
          </h4>
          <div class="jy-transfer-right-main" :class="{'jy-transfer-right-main-scroll': jyCheckedOptions.length > 12}">
            <CheckList
              :dataList="jyCheckedOptions"
              ref="CheckListBox"
              @delClick="delClick"
            >
            </CheckList>
          </div>

        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div>
          <el-button
            :disabled="!jyCheckedOptions.length"
            type="primary"
            @click="confirm"
            :loading="loading"
            size="medium"
          >
            确 定
          </el-button>
          <el-button @click="reset" size="medium" type="primary" plain>
            重 置
          </el-button>
          <el-button @click="close" size="medium" type="primary" plain>
            取 消
          </el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  // 全量
  orgAllCustomer,
  // 已绑定
  listOrgCustomer,
  listTradeCustomer,
  // 已绑定且未注销
  listOrgUncancelCustomer,
  listOrgCustomerUnAuth
} from '@/api/intl/legacy/bus-jgt-account'
// 已选择寻滚动组件
import CheckList from '@/views/components/jgt-user-dialog/CheckList'
import { cloneDeep } from 'lodash'
export default {
  components: {
    CheckList
  },
  props: {
    // 下拉框
    selectPlaceholder: {
      type: String,
      default: '请选择基煜账户'
    },
    // 弹窗名称
    dialogTitle: {
      type: String,
      default: '请选择基煜账户'
    },
    // 下拉框是否禁用
    disabled: {
      tyoe: Boolean,
      default: false
    },
    // 下拉框搜索
    filterable: {
      tyoe: Boolean,
      default: true
    },
    // 默认值 必传
    defaultVal: {
      type: String,
      default: '',
      require: true
    },
    dataOrigin: {
      type: String,
      default: 'listOrgCustomer'
    },
    activeName: {
      type: String,
      default: ''
    },
    isNeedId: {
      type: Boolean,
      default: false
    },
    defaultWidth: {
      type: String,
      default: '220px'
    }
  },
  data () {
    return {
      loading: false,
      // 全选
      checkAll: false,
      // 弹窗显示控制
      visible: false,
      commonCheckAll: false,
      otherCheckAll: false,
      // 已选列表
      checkList: [],
      // 搜索已选列表
      checkSearchList: [],
      // 记录上次搜索接口
      checkOldList: [],
      // 搜索条件
      searchText: '',
      // 接口调用
      api: {
        listOrgCustomer: listOrgCustomer,
        listOrgUncancelCustomer: listOrgUncancelCustomer,
        orgAllCustomer: orgAllCustomer,
        listOrgCustomer1: listOrgCustomer,
        listOrgUncancelCustomer1: listOrgUncancelCustomer,
        listOrgUncancelCustomer2: listOrgUncancelCustomer,
        listTradeCustomer: listTradeCustomer,
        listOrgCustomerUnAuth: listOrgCustomerUnAuth
      },
      // 接口返回原数据
      resData: [],
      // 下拉框数据
      transferData: [],
      // 左侧复选框数据
      transferDataList: [],
      // 左侧搜索数据
      filterSearchData: [],
      // 下拉框
      selectValue: '',
      // 是否是半选
      isIndeterminate: false,
      // 是否是搜索
      isSearch: false,
      // 已选账户
      checkedLegNum: 0,
      // 是否是存在常用账户
      isjyOptions: false,
      jyOptionData: [],
      // 是否存在其他账户
      isjgtOsptions: false,
      jgtOsptionData: [],
      // 虚拟滚动
      listData: [],
      searchListData: [],
      viewH: 310,
      itemH: 24,
      lastTime: '', // 上次执行滚动事件的时刻
      scorllH: '', // 列表总高度
      offSetY: '', // 动态偏移量
      showNum: '' // 显示的个数
    }
  },
  computed: {
    // 已选id
    jyCheckedOptions () {
      return (
        this.checkList.length ? this.checkList.map((i) => {
          return this.transferDataList.find((j) => j.id === i)
        }).sort((item, item1) => {
          return item.sort - item1.sort
        }) : []
      )
    },
    // 显示已选
    textEllipsisBox () {
      return (
        (this.jyCheckedOptions.length > 1 &&
          this.jyCheckedOptions.length !== this.transferData.length - 1) ||
        (this.checkOldList.length > 1 &&
          this.checkOldList.length !== this.transferData.length - 1)
      )
    },
    // 已选长度
    checkedLeg () {
      return this.jyCheckedOptions.length &&
        this.jyCheckedOptions.length === this.transferData.length - 1
        ? this.jyCheckedOptions.length
        : this.checkOldList.length
          ? this.checkOldList.length
          : 0
    }
  },
  watch: {
    // 控制dialog显示隐藏
    visible (val) {
      if (val) {
        this.searchText = ''
        this.$nextTick(() => {
          this.offSetY = 0
        })
        if (!this.defaultVal) {
          this.checkList = this.transferData
            .filter((item) => item.id)
            .map((item) => item.id)
          this.checkAll = true
          this.otherCheckAll = true
          this.commonCheckAll = true
          this.isIndeterminate = false
          this.checkOldList = this.checkList
          this.scorllHData()
        }
      }
    },
    // 监听搜索条件
    searchText (val) {
      if (val) {
        this.isSearch = true
      } else {
        this.isSearch = false
      }
      this.setOptions()
    },
    // 默认值处理
    defaultVal: {
      handler (val, oldVal) {
        if (val) {
          this.defaultLabe(val)
          return false
        }
        this.checkList = []
        this.checkOldList = []
        if (this.transferData.length === 1) {
          return
        }
        this.selectValue = ''
      },
      deep: true
    },
    dataOrigin: {
      handler (val, oldVal) {
        if (val && val !== oldVal) {
          this.renderList()
        }
      },
      deep: true
    }
  },
  created () {
    this.commonParams = this.createCommonParams()
  },
  mounted () {
    this.renderList()
  },
  methods: {
    hanldeScroll (e) {
      this.offSetY = e.target.scrollTop - (e.target.scrollTop % this.itemH) // 设置动态偏移量模拟滚动
      if (this.isSearch) {
        this.searchListData = this.filterSearchData && this.filterSearchData.length ? this.filterSearchData.slice(
          Math.floor(e.target.scrollTop / this.itemH),
          Math.floor(e.target.scrollTop / this.itemH) + this.showNum
        ) : []
      } else {
        this.listData = this.transferDataList && this.transferDataList.length ? this.transferDataList.slice(
          Math.floor(e.target.scrollTop / this.itemH),
          Math.floor(e.target.scrollTop / this.itemH) + this.showNum
        ) : []
      }
      // 根据滚动条高度来截取需要展示的列表区间
      this.lastTime = new Date().getTime()
    },
    filter (v) {
    },
    // 创建公共接口参数
    createCommonParams () {
      const orgCode = this.util.cookies.get('orgCode')
      const uuid = this.util.cookies.get('uuid')
      if (!orgCode || !uuid) {
        return false
      }
      return {
        orgCode: orgCode,
        operatorCode: uuid
      }
    },
    // 全选相关逻辑
    selectAll (val) {
      // 搜索全选
      if (this.isSearch) {
        let newArr = []
        // 过滤分类id
        const filterSearchDataList = this.filterSearchData.length && this.filterSearchData.filter(item => {
          return item.id !== 'changyong' && item.id !== 'qita'
        }).map(item => item.id)
        const filterSearchData = this.filterSearchData.length && this.filterSearchData.filter(item => {
          return item.id !== 'changyong' && item.id !== 'qita'
        })
        const checkjyOptions = val && this.filterSearchData.length ? filterSearchDataList : []
        if (!val) {
          const checkjySearch = this.filterSearchData.length ? filterSearchDataList : []
          const checkSearchData = [...checkjySearch]
          const hash = {}
          checkSearchData.forEach((item) => {
            if (!hash[item]) {
              hash[item] = item
            }
          })
          this.checkList.forEach((i) => {
            if (!hash[i]) {
              newArr.push(i)
            }
          })
        } else {
          this.checkSearchList = [...checkjyOptions]
          let set = new Set([...this.checkList, ...this.checkSearchList]) // 去掉重复数据，返回结果是'set'
          newArr = Array.from(set) // 将set转化为数组
        }
        this.setAllCheck(filterSearchData, checkjyOptions)
        this.checkList = newArr
        this.isIndeterminate = false
        return false
      }
      const checkTransferDataList = val && this.transferDataList.length ? this.transferDataList.filter(item => {
        return item.id !== 'changyong' && item.id !== 'qita'
      }).map(item => item.id) : []
      this.checkList = [...checkTransferDataList]
      this.otherCheckAll = !!this.checkList.length
      this.commonCheckAll = !!this.checkList.length
      this.isIndeterminate = false
    },
    // 选择某一项之后，更新全选框的值
    checkedChange (value) {
      // 过滤分类id
      const filterSearchDataList = this.filterSearchData.length && this.filterSearchData.filter(item => {
        return item.id !== 'changyong' && item.id !== 'qita'
      })
      // 过滤分类id
      const transferDataList = this.transferDataList.length && this.transferDataList.filter(item => {
        return item.id !== 'changyong' && item.id !== 'qita'
      })
      if (this.searchText && filterSearchDataList.length) {
        const checkSearch = []
        let searchDataList = {}
        // 将搜索内容处理成hash
        filterSearchDataList.forEach(item => {
          if (!searchDataList[item.id]) {
            searchDataList[item.id] = item
          }
        })
        // 判断当前选择是否在搜索内容中
        value.forEach((i) => {
          if (searchDataList[i]) {
            checkSearch.push(i)
          }
        })
        // 判断是否全选以及是否半选
        let checkedCount = checkSearch.length
        let allLeg = filterSearchDataList.length
        this.setAllCheck(filterSearchDataList, value)
        this.checkAll = checkedCount === allLeg
        this.isIndeterminate = checkedCount > 0 && checkedCount < allLeg
        return false
      }
      let checkedCount = value.length
      let allLeg = transferDataList.length

      // 常用账户 其他账户全选判断
      this.setAllCheck(transferDataList, value)
      this.checkAll = checkedCount === allLeg
      this.isIndeterminate = checkedCount > 0 && checkedCount < allLeg
    },
    setAllCheck (transferDataList, value) {
      /*
        transferDataList: 源数据
        value： 已选数据
      */
      // 常用账户 其他账户全选判断
      const jyOptions = transferDataList.filter(
        (item) => {
          return item.commonFlag === 'Y'
        }
      ).map(item => item.id)
      // 其他账户
      const jgtOptions = transferDataList.filter(
        (item) => item.commonFlag !== 'Y'
      ).map(item => item.id)

      // 常用账户hash
      const hashJy = value.map(i => {
        return jyOptions.find(j => j === i)
      }).filter(item => item)
      // 其他账户hash
      const hashJgt = value.map(i => {
        return jgtOptions.find(j => j === i)
      }).filter(item => item)
      this.otherCheckAll = jgtOptions.length === hashJgt.length
      this.commonCheckAll = jyOptions.length === hashJy.length
    },
    switchChange (val, txt) {
      if (val) {
        if (this.isSearch) {
          let newArr = []
          // 过滤分类id
          const filterSearchDataList = this.filterSearchData.length && this.filterSearchData.filter(item => {
            return item.id !== 'changyong' && item.id !== 'qita'
          })
          const filterSearchDataListHash = {}
          filterSearchDataList.forEach(item => {
            filterSearchDataListHash[item.id] = item
          })
          // 常用账户
          const jyOptions = filterSearchDataList.filter(
            (item) => {
              return item.commonFlag === 'Y'
            }
          ).map(item => item.id)
          let set = new Set([...this.checkList, ...jyOptions]) // 去掉重复数据，返回结果是'set'
          newArr = Array.from(set) // 将set转化为数组
          this.checkList = newArr
          const isTrueData = []
          newArr.forEach(item => {
            if (filterSearchDataListHash[item]) {
              isTrueData.push(item)
            }
          })
          this.checkAll = filterSearchDataList.length === isTrueData.length
          this.isIndeterminate = !this.checkAll
          return false
        }
        // 全选
        this.setCheckAllFn(this.transferDataList, this.jyOptionData)
      } else {
        if (this.isSearch) {
          // 常用账户
          const jyOptions = this.filterSearchData.length && this.filterSearchData.filter(
            (item) => {
              return item.commonFlag === 'Y' && item.id !== 'changyong' && item.id !== 'qita'
            }
          )
          this.setClearAll(jyOptions)
          return false
        }
        this.setClearAll(this.jyOptionData)
      }
    },
    switchJgtChange (val, txt) {
      if (val) {
        if (this.isSearch) {
          let newArr = []
          // 过滤分类id
          const filterSearchDataList = this.filterSearchData.length && this.filterSearchData.filter(item => {
            return item.id !== 'changyong' && item.id !== 'qita'
          })
          const filterSearchDataListHash = {}
          filterSearchDataList.forEach(item => {
            filterSearchDataListHash[item.id] = item
          })
          // 常用账户
          const jyOptions = filterSearchDataList.filter(
            (item) => {
              return item.commonFlag !== 'Y'
            }
          ).map(item => item.id)
          let set = new Set([...this.checkList, ...jyOptions]) // 去掉重复数据，返回结果是'set'
          newArr = Array.from(set) // 将set转化为数组
          this.checkList = newArr
          const isTrueData = []
          newArr.forEach(item => {
            if (filterSearchDataListHash[item]) {
              isTrueData.push(item)
            }
          })
          this.checkAll = filterSearchDataList.length === isTrueData.length
          this.isIndeterminate = !this.checkAll
          return false
        }
        this.setCheckAllFn(this.transferDataList, this.jgtOsptionData)
      } else {
        if (this.isSearch) {
          // 常用账户
          const jyOptions = this.filterSearchData.length && this.filterSearchData.filter(
            (item) => {
              return item.commonFlag !== 'Y' && item.id !== 'changyong' && item.id !== 'qita'
            }
          )
          this.setClearAll(jyOptions)
          return false
        }
        this.setClearAll(this.jgtOsptionData)
      }
    },
    setCheckAllFn (data, typeData) {
      /*
        data: 数据源
        typeData：常用账户/其他账户数据源
      */
      const checkTransferDataList = data.length ? data.filter(item => {
        return item.id !== 'changyong' && item.id !== 'qita'
      }) : []
      const jgtOsptionDataId = typeData.map(item => item.id)
      let set = new Set([...this.checkList, ...jgtOsptionDataId]) // 去掉重复数据，返回结果是'set'
      const newArr = Array.from(set) // 将set转化为数组
      this.checkList = newArr
      this.checkAll = checkTransferDataList.length === this.checkList.length
      this.isIndeterminate = !this.checkAll
    },
    // 分类清空时触发
    setClearAll (typeData) {
      /*
      typeData：常用账户/其他账户数据源
      */
      // 需要清空的数据
      const clearJyoption = {}
      // 其他账户 常用账户 遍历出hash值
      typeData.forEach(item => {
        if (!clearJyoption[item]) {
          clearJyoption[item.id] = item
        }
      })
      // 需要清空的数组
      const noJyOption = []
      // 遍历出不需要清空的值
      this.checkList.forEach(item => {
        if (!clearJyoption[item]) {
          noJyOption.push(item)
        }
      })
      // 赋值给checkList
      this.checkList = noJyOption
      // 清空全选
      this.checkAll = false
      // 是否半选
      this.isIndeterminate = this.checkList.length ? this.otherCheckAll || this.commonCheckAll : false
    },
    // 过滤搜索词 以及搜索选中
    setOptions () {
      const text = this.searchText.trim()
      const transferData = this.transferData.filter((item, index) => {
        return index !== 0 && item.id !== 'changyong' && item.id !== 'qita'
      })
      // 常用账户
      const filterData = transferData
        .filter((i) => i.label.indexOf(text) > -1)
        .filter((item) => item.commonFlag === 'Y')

      // 非常用账户
      const filterData1 = transferData
        .filter((i) => i.label.indexOf(text) > -1)
        .filter((item) => item.commonFlag !== 'Y')

      if (filterData.length) {
        filterData.unshift({
          id: 'changyong',
          label: this.isjgtOsptions ? '常用账户' : '全部账户',
          sort: 0
        })
      }
      if (filterData1.length) {
        filterData1.unshift({
          id: 'qita',
          label: this.isjyOptions ? '其他账户' : '全部账户',
          sort: 0
        })
      }
      if (this.searchText) {
        this.filterSearchData = [...filterData, ...filterData1]
        const searchTransferData = this.filterSearchData.filter((item, index) => {
          return index !== 0 && item.id !== 'changyong' && item.id !== 'qita'
        })
        const checkSearchList = []
        const checkListId = {}
        this.checkList.forEach(item => {
          if (!checkListId[item]) {
            checkListId[item] = item
          }
        })
        this.filterSearchData.forEach(item => {
          if (checkListId[item.id]) {
            checkSearchList.push(item.id)
          }
        })
        let checkedCount = checkSearchList.length
        let allLeg = this.filterSearchData.filter(item => {
          return item.id !== 'changyong' && item.id !== 'qita'
        }).length
        this.checkAll = checkedCount !== 0 && checkedCount === allLeg
        if (this.checkAll) {
          this.otherCheckAll = true
          this.commonCheckAll = true
        }
        this.setAllCheck(searchTransferData, this.checkList)
        this.isIndeterminate = checkedCount !== 0 && checkedCount !== allLeg
        // 可视区域数据
        this.scorllHData()
        return false
      }
      let checkedCount = this.checkList.length
      let jyOptionsleg = filterData.filter(item => {
        return item.id !== 'changyong'
      }).length
      let jgtOptionsleg = filterData1.filter(item => {
        return item.id !== 'qita'
      }).length
      let allLeg = jyOptionsleg + jgtOptionsleg
      this.checkAll = checkedCount !== 0 && checkedCount === allLeg
      if (this.checkAll) {
        this.otherCheckAll = true
        this.commonCheckAll = true
      }
      this.isIndeterminate = checkedCount !== 0 && checkedCount !== allLeg
      this.setAllCheck(transferData, this.checkList)
      // 可视区域数据
      this.scorllHData()
    },
    // 右侧删除
    delClick (row) {
      if (this.searchText) {
        this.checkList = this.checkList.filter((i) => {
          return i !== row.id
        })
        const checkSearch = []
        const hash = {}
        this.filterSearchData.forEach((j) => {
          if (!hash[j.id]) {
            hash[j.id] = j
          }
        })
        this.checkList.forEach((i) => {
          if (hash[i]) {
            checkSearch.push(i)
          }
        })
        const filterSearchDataList = this.filterSearchData.length && this.filterSearchData.filter(item => {
          return item.id !== 'changyong' && item.id !== 'qita'
        })
        this.setAllCheck(filterSearchDataList, this.checkList)
        if (hash[row.id]) {
          this.isIndeterminate = !!checkSearch.length
          this.checkAll = false
        }
        return false
      }
      this.checkList = this.checkList.filter((i) => {
        return i !== row.id
      })
      // 过滤分类id
      const transferDataList = this.transferDataList.length && this.transferDataList.filter(item => {
        return item.id !== 'changyong' && item.id !== 'qita'
      })
      this.setAllCheck(transferDataList, this.checkList)
      this.checkAll = false
      this.isIndeterminate = !!this.checkList.length
    },
    // 单选逻辑
    handleChange (value) {
      this.checkList = []
      this.isIndeterminate = false
      this.$emit('change', value ? [value] : [])
    },
    // 确认
    confirm () {
      this.loading = true
      let checkDataId = []
      // 左侧选中
      const leg = this.jyCheckedOptions.length
      if (this.jyCheckedOptions && leg) {
        checkDataId = this.jyCheckedOptions.map((item) => item.id)
        this.selectValue =
          leg > 1
            ? `${this.jyCheckedOptions[0].label}`
            : this.jyCheckedOptions[0].label
      } else {
        this.selectValue = ''
      }
      this.checkOldList = JSON.parse(JSON.stringify(checkDataId))
      // 没有选择项以及选择项与返回数量一直 返回为全部基煜账户
      if (
        !checkDataId.length ||
        checkDataId.length === this.transferData.length - 1
      ) {
        this.selectValue = this.transferData[0].id
        this.$emit('change', [])
        this.visible = false
        this.loading = false
        this.resetOffSety()
        return false
      }
      this.checkedLegNum = this.checkedLeg
      this.$emit('change', checkDataId)
      this.searchText = ''
      this.visible = false
      this.loading = false
      this.resetOffSety()
    },
    resetOffSety () {
      if (this.$refs.hanldeScrollBox) {
        this.$refs.hanldeScrollBox.scrollTop = 0
        if (this.$refs.CheckListBox) {
          this.$refs.CheckListBox.scrollTop = 0
        }
        // 可视区域数据
        // setTimeout(() => {
        //   this.scorllHData()
        // }, 0)
      }
    },
    // 重置
    reset () {
      this.checkList = []
      this.isIndeterminate = false
      this.checkAll = false
      this.commonCheckAll = false
      this.otherCheckAll = false
      this.searchText = ''
    },
    close () {
      this.checkList = this.checkOldList
      this.checkedChange(this.checkOldList)
      this.searchText = ''
      this.visible = false
      this.resetOffSety()
    },
    // 默认选项
    defaultLabe (val) {
      if (!this.transferData.length) {
        return false
      }
      const defaultVal = val.split(',')
      const selectValueData = defaultVal.length && defaultVal.map((i) => {
        return this.transferData.find((j) => j.id === i)
      })
        .filter((item) => {
          return item
        })

      const leg = selectValueData.length
      if (leg === this.transferData.length - 1) {
        this.isIndeterminate = false
      } else {
        this.isIndeterminate = true
      }
      if (leg) {
        this.selectValue =
          leg === this.transferData.length - 1
            ? ''
            : leg > 1
              ? `${selectValueData[0].label}`
              : selectValueData[0].label
        this.checkList = selectValueData.map((item) => item.id)
        this.checkOldList = JSON.parse(JSON.stringify(selectValueData.map((item) => item.id)))
        const transferData = this.transferData.filter((item, index) => {
          return index !== 0
        })
        this.setAllCheck(transferData, this.checkList)
        this.checkedLegNum = this.checkedLeg
        return false
      }
      this.selectValue = ''
      this.checkList = []
      this.checkOldList = []
      this.$emit('change', [])
    },
    scorllHData () {
      if (this.isSearch) {
        // 计算总高度
        this.scorllH = (this.itemH * this.filterSearchData.length + 80) + 'px'
        // 计算可视区域能展示的个数 这里可以随机多加几个让滚动有个临界区间，避免向下滑动时元素直接替换
        this.showNum = this.viewH / this.itemH + 4
        this.lastTime = new Date().getTime()
        // 默认展示
        this.searchListData = this.filterSearchData && this.filterSearchData.length ? this.filterSearchData.slice(0, this.showNum) : []
        return false
      }
      // 计算总高度
      this.scorllH = (this.itemH * this.transferDataList.length + 80) + 'px'
      // 计算可视区域能展示的个数 这里可以随机多加几个让滚动有个临界区间，避免向下滑动时元素直接替换
      this.showNum = this.viewH / this.itemH + 4
      this.lastTime = new Date().getTime()
      // 默认展示
      this.listData = this.transferDataList && this.transferDataList.length ? this.transferDataList.slice(0, this.showNum) : []
    },
    /**
     * 渲染列表
     */
    renderList () {
      if (!this.commonParams) {
        return false
      }
      let params = this.commonParams
      if (['listOrgUncancelCustomer', 'listOrgUncancelCustomer1', 'listOrgUncancelCustomer2'].includes(this.dataOrigin) && ['needSign', 'reSign'].includes(this.activeName)) {
        params.mainFlag = '0'
      } else if (params.mainFlag) {
        delete params.mainFlag
      }
      this.api[this.dataOrigin](params).then((res) => {
        if (res && res.customerDTOList && res.customerDTOList.length > 0) {
          // 下拉数据
          this.transferData = res.customerDTOList.map((item, index) => {
            return {
              id: item.fofundNo,
              label: item.fofundShortName
                ? item.fofundShortName
                : item.fofundName,
              commonFlag: item.commonFlag,
              itemData: item
            }
          })
          res.customerDTOList.forEach(item => {
            item.fofundShortName = item.fofundShortName || item.fofundName
          })
          this.$emit('resDataChange', res.customerDTOList)
          // 单账户
          if (this.transferData && this.transferData.length === 1) {
            this.selectValue = this.transferData[0].label
            this.$emit(
              'change',
              this.isNeedId ? [this.transferData[0].id] : [],
              true
            )
            return false
          }
          const transferData = JSON.parse(JSON.stringify(this.transferData))

          // 常用账户
          const jyOptions = transferData.filter(
            (item) => {
              return item.commonFlag === 'Y'
            }
          )
          jyOptions.forEach((item, index) => {
            this.$set(item, 'sort', index + 1)
          })
          // 其他账户
          const jgtOptions = transferData.filter(
            (item) => item.commonFlag !== 'Y'
          )
          this.isjyOptions = !!jyOptions.length
          this.isjgtOsptions = !!jgtOptions.length
          this.jyOptionData = cloneDeep(jyOptions)
          this.jgtOsptionData = cloneDeep(jgtOptions)
          if (jyOptions.length) {
            jyOptions.unshift({
              id: 'changyong',
              label: jgtOptions.length ? '常用账户' : '全部账户',
              sort: 0,
              checkedActive: true
            })
          }
          if (jgtOptions.length) {
            jgtOptions.unshift({
              id: 'qita',
              label: jyOptions.length ? '其他账户' : '全部账户',
              sort: 0,
              checkedActive: true
            })
          }
          jgtOptions.forEach((item, index) => {
            this.$set(item, 'sort', index + 1 + jgtOptions.length)
          })

          this.transferDataList = [...JSON.parse(JSON.stringify(jyOptions)), ...JSON.parse(JSON.stringify(jgtOptions))]
          // 可视区域数据
          this.scorllHData()
          // 全部基煜账户为空
          this.transferData.unshift({
            id: '',
            label: '全部基煜账户',
            sort: 0
          })
          // 默认选中
          if (this.defaultVal) {
            this.defaultLabe(this.defaultVal)
            return false
          }
          this.selectValue = ''
        } else {
          this.selectValue = '暂无数据'
          return false
        }
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss">
.select-box {
  height: 32px;
  box-sizing: border-box;
  display: inline-block;
  @include backgroundColor(A2);
  position: relative;
  .el-select{
    .el-select-dropdown.el-popper{
      width: 100% !important;
      left: 0px !important;
    }
  }
  .text-ellipsis {
    width: 100%;
    .el-input {
      input {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .text-ellipsis-box {
    .el-input {
      input {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-left: 70px;
      }
    }
  }
  .multiple-box {
    position: absolute;
    @include backgroundColor(A2h);
    left: 5px;
    top: 50%;
    transform: translateY(-50%);
    height: 14px;
    line-height: 14px;
    padding: 4px 5px;
    z-index: 20;
    font-size: 13px;
    border-radius: 2px;
  }
  .select-box-icon {
    position: absolute;
    right: 1px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    padding: 0 8px 0 8px;
    box-sizing: border-box;
    width: 30px;
    height: 30px;
    line-height: 30px;
    z-index: 1;
    &:hover{
      @include backgroundColor(A2h);
    }
  }
  .val-box {
    position: absolute;
    top: 0px;
    left: 0px;
    @include backgroundColor(A1);
    height: 32px;
    line-height: 30px;
    border-radius: 2px;
    display: inline-block;
    padding: 0 15px;
    box-sizing: border-box;
    font-size: 13px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.jy-transfer {
  height: 360px;
  display: flex;

  .jy-transfer-left,
  .jy-transfer-right {
    flex: 1;
    overflow-x: hidden;
  }
  .jy-transfer-right{
    margin-left: 0px;
    flex: 0 0 466px;
    .jy-transfer-left-title {
      width: 452px;
      padding-right: 0;
      box-sizing: border-box;
      @include backgroundColor(A11);
      margin-bottom: 2px;
      height: 48px;
      line-height: 48px;
      padding-left: 10px;
      @include color(A10);
      font-weight: 400;
    }
     .jy-transfer-right-main {
        width: 452px;
        @include backgroundColor(A11);
        padding: 10px 0 20px 10px;
        height: 310px;
        overflow-y: auto;
        box-sizing: border-box;
      }
      .jy-transfer-right-main-scroll{
        width: 459px;
      }
  }
  .jy-transfer-left {
    width: 486px;
    box-sizing: border-box;
    .jy-transfer-left-title {
      padding: 10px 10px;
      padding-right: 0;
      box-sizing: border-box;
      @include backgroundColor(A11);
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 482px;
      margin-bottom: 2px;
      .el-checkbox__label{
        font-size: 13px !important;
      }
      .el-input {
        margin-left: 20px;
        height: 28px;
        line-height: 28px;
        .el-input__inner {
          height: 28px;
          line-height: 28px;
          font-size: 13px;
        }
      }
      .el-input__icon {
        line-height: 28px;
      }
    }
    .jy-transfer-left-main {
      h4 {
        font-weight: 500;
        @include color(A6);
        margin-bottom: 10px;
      }
      width:484px;
      @include backgroundColor(A11);
      padding: 0px 10px 20px 10px;
      height: 310px;
      box-sizing: border-box;
      .el-checkbox {
        display: block;
        height: 24px;
        line-height: 24px;
        font-size: 13px;
        @include color(A6);
        .el-checkbox__label {
          overflow: hidden;
          text-overflow: ellipsis; //超出部分以省略号显示
          white-space: nowrap;
          width: 446px;
          font-size: 13px !important;
        }
        &:hover {
          .el-checkbox__label {
            @include color(A10);
          }
        }
      }
      .hideAllRef.el-checkbox{
        &.is-disabled{
          cursor: default !important;
        }
        margin: 10px 0 4px;
        .el-checkbox__input{
          display: none;
        }
        .el-checkbox__label{
          font-size: 13px !important;
          padding-left: 0;
          @include color(A6);
          &:hover {
            .el-checkbox__label {
              @include color(A10);
            }
          }
        }
      }
      .hideRef.el-switch{
        margin: 16px 0 4px;
        .el-switch__label{
          @include color(A6);
          span{
            font-size: 13px !important;
          }
          font-weight: 600;
          &.is-active{
            @include color(A10);
          }
          &:hover {
            @include color(A10);
          }
        }
        .el-switch__core{
          @include backgroundColor(A2);
          display: inline-block;
          position: relative;
          border: 1px solid silver;
          border-radius: 2px;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          width: 14px !important;
          height: 14px;
          &::after{
            display: none;
          }
          &::before{

          }
          &:hover{
            @include borderColor(A10);
          }
        }
        &.is-checked{
          .el-switch__core{
            position: relative;
            @include backgroundColor(A10);
            @include borderColor(A10);
            &::after{
              display: none;
            }
            &::before{
              -webkit-box-sizing: content-box;
              box-sizing: content-box;
              content: "";
              border: 1px solid;
              @include borderColor(A7);
              border-left: 0;
              border-top: 0;
              height: 7px;
              left: 4px;
              position: absolute;
              top: 1px;
              -webkit-transform: rotate(45deg) scaleY(0);
              transform: rotate(45deg) scaleY(0);
              width: 3px;
              -webkit-transition: -webkit-transform .15s ease-in .05s;
              transition: -webkit-transform .15s ease-in .05s;
              transition: transform .15s ease-in .05s;
              transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
              transition: transform .15s ease-in .05s,-webkit-transform .15s ease-in .05s;
              -webkit-transform-origin: center;
              transform-origin: center;
              -webkit-transform: rotate(45deg) scaleY(1);
              transform: rotate(45deg) scaleY(1);
            }
          }
        }

      }
      .hideRef.is-indeterminate.el-switch{
        .el-switch__core{
          @include backgroundColor(A2);
          @include borderColor(A10);
          &::after{
            content: '';
            position: absolute;
            display: block;
            background-color: #FFF;
            height: 2px;
            left: 0;
            transform: scale(0.5);
            right: 0;
            top: 5px;
            width: 12px;
            z-index: 3;
          }
        }
      }
    }

  }

  .other_title{
    margin-top: 20px;
  }
}
.user-dialog-main{
  .el-dialog {
    .el-dialog__body{
      padding: 24px 16px !important;
      max-height: 400px;
      overflow-y: auto;
    }
  }
}
</style>
