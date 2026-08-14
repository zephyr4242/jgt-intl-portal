# jgt-top-search
示例页面：账户信息 => 列表页 点击详情=> 账户信息详情
```
<!-- 使用 -->
 <HandleButtons
    :handleBtns="handleBtns()"
    @click="handleBtnFn"
    >
</HandleButtons>

```
### HandleBtns 操作按钮
```
prop

<!-- 禁用条件 可设置多条件禁用-->
openBtnDisabled () {
    return !this.checkedTaCode.length
},
handleBtns () {
    return [
    {
        id: 1,
        label: '开立基金账户 ',
        type: 'primary',
        noPlain: true,
        isDisabled: this.btnDisabled(),
        tips: '对不起，您没有交易权限' // 可改为方法根据条件返回自己的tips
    },
    {
        id: 2,
        label: '批量确认单',
        isDisabled: this.btnDisabledTwo
    },
    {
        id: 3,
        label: '导出数据',
        isDisabled: this.btnDisabledTwo
    }
    ]
},
openBtnDisabled () {
    return !this.checkedTaCode.length
},
```

### SearchForm 多行展示处理 
```
props 
searchFields 搜索条件渲染数组
isSearchBtn 是否需要搜索按钮
createSearchFields () {
return [
    {
        mode: 'registrationAgency', // 字段名
        component: 'el-input', // 组件名
        searchIcon: true, // 搜索icon 
        bind: { // 组件属性
        placeholder: '请输入注册登记机构',
        clearable: true
        }
    },
    {
        mode: 'fundAccount',
        component: 'el-input',
        searchIcon: true,
        bind: {
        placeholder: '请输入基金账号',
        clearable: true
        }
    },
    {
        mode: 'businFlag', // 字段名
        component: 'el-select', // 组件名
        bind: { // 组件属性
        placeholder: '请选择业务类别', 
        clearable: true
        },
        // 下拉框数据
        options: [
        {
            id: '001',
            label: '开户'
        },
        {
            id: '003',
            label: '资料修改'
        }
        ]
    }
    ]
}
// 改变页面自定义事件
getData 接收改变数据返回
this.$emit('getData', this.form)
```