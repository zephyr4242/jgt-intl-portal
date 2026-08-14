<template>
  <div>
    <el-table v-bind="$attrs" v-on="$listeners" style="width: 100%">
      <template v-for="(item, index) in columns">
        <!-- 带有type类型的列 -->
        <template v-if="item.type">
          <el-table-column
            :key="index"
            :label="item.label || ''"
            :prop="item.prop || ''"
            :type="item.type || ''"
            :width="item.width || ''"
            :align="item.align || 'center'"
          >
          </el-table-column>
        </template>
        <!-- 普通的列 -->
        <template v-else>
          <el-table-column
            :key="index"
            :label="item.label || ''"
            :prop="item.prop || ''"
            :type="item.type || ''"
            :width="item.width || ''"
            :align="item.align || 'center'"
          >
            <template slot-scope="scope">
              <!-- 带有插槽名字列 -->
              <span v-if="item.slot">
                <slot
                  :name="item.slot"
                  :row="scope.row"
                  :index="scope.$index"
                  :column="scope.column"
                >
                </slot>
              </span>
              <!-- 正常展示的列 -->
              <span v-else class="ellipsis"> {{ scope.row[item.prop] }} </span>
            </template>
          </el-table-column>
        </template>
      </template>
    </el-table>
    <!-- 分页 -->
    <template v-if="pageObj">
      <el-pagination
        v-bind="$attrs"
        v-on="$listeners"
        :page-size="pageObj.size"
        :total="pageObj.total"
        :current-page="pageObj.currentPage"
      >
      </el-pagination>
    </template>
  </div>
</template>

<script>
export default {
  name: 'jy-table',
  computed: {},
  props: {
    /**
     * 表格表头数据
     */
    columns: {
      type: Array,
      default: () => []
    },
    /**
     * 分页对象
     */
    pageObj: null,
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  },
  watch: {},
  methods: {},
  created () {},
  mounted () {}
}
</script>

<style lang='scss' scoped>
.ellipsis{
  width: 100%;
}
</style>
