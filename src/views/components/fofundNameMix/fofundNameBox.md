<!-- 基煜账户名换行fofundNameBox组件说明 -->
### 基煜账户名换行fofundNameBox组件有tableTh配置使用
示例： 
```
<!-- 有tableTh配置使用 -->
<!-- html -->
<FofundNameBox :width="conf && conf.width ? conf.width : '100px'" v-else-if="conf.value === 'fofundName'" :orginData="{scope: scope, conf: conf}"></FofundNameBox>
<!-- 引入组件 -->
import FofundNameBox from '@/views/components/fofundNameMix/FofundNameBox'
<!-- 引入组件mix -->
import fofundNameMix from '@/views/components/fofundNameMix/index.js'
<!-- 注册组件 -->
components: {
    FofundNameBox
}
<!-- 获取数组之后设置最大宽度  -->
this.setWidth(data.records, this.selectedColumns)

</el-table-column>

```
### 无table配置使用

```
<!-- 需要设置最大宽度 -->
<el-table-column label="基煜账户名称" prop="fofundName" :width="setNoThWidth(tableData)" resizable show-overflow-tooltip >
<template slot-scope="scope">
    <!-- 基煜账户名 -->
    <FofundNameBox :orginData="{scope:scope, tableData: tableData} " :className="'fofundNameNoTh'"></FofundNameBox>
</template>
<FofundNameBox :xwidth="conf && conf.width ? conf.width : '100px'" v-else-if="conf.value === 'fofundName'" :orginData="{scope: scope, conf: conf}"></FofundNameBox>
<!-- 引入组件 -->
import FofundNameBox from '@/views/components/fofundNameMix/FofundNameBox'
<!-- 引入组件mix -->
import fofundNameMix from '@/views/components/fofundNameMix/index.js'
<!-- 注册组件 -->
components: {
    FofundNameBox
}
```