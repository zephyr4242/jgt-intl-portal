#### 引入

```
import jgtUserDialog from '@/views/components/jgt-user-dialog'
```

####  注册

```
components: {
   'jgt-user-dialog': jgtUserDialog
}
```

#### 使用 参数一般不传
主要参数

```
/*
下拉框Placeholder
selectPlaceholder: {
  type: String,
  default: '请选择基煜账户'
},
弹窗title
dialogTitle: {
  type: String,
  default: '选择基煜账户'
},
默认值 一般不选
value: {
  required: false
},
禁用下拉框
disabled: {
  default: false
},
下拉框搜索
filterable: {
  default: true
},
默认选择
defaultVal: {
  type: String,
  default: 'first'
},
单账户是否需要id
isNeedId: {
  type: Boolean,
  default: false
},
调用接口名称
dataOrigin: {
  type: String,
  default: 'listOrgCustomer'
}
*/
```


```
<el-form-item>
  <jgt-user-dialog  @change="checkUserChange" />
</el-form-item>
```

#### 取值赋值（返回值为数组）

```
checkUserChange (val) {
  this.paramsData.fofundNoList = JSON.parse(JSON.stringify(val))
}
```
