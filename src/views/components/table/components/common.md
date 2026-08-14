# columeTh 数组 参数如需要element ui中属性，其属性名需要与element ui一致
## tabel Cell组件说明

<!-- render函数 -->
### CenterEllipsis 中间加密省略
示例： 
TH中 定义componentsName: '组件名' 驼峰或缩写
```
{
    label: '银行账号',
    prop: 'totalIncome',
    componentsName: 'center-ellipsis'
}

```
### DateTime 处理日期  
```
{
    label: '开户时间',
    prop: 'openDate', // 字段名称
    componentsName: 'date-time', // 日期组件名
    dateType, // 'YYYY-MM-DD HH:mm:ss' 日期类型 自定义
    timeType // 'HH:mm:ss' 日期时间  传2行显示 不传1行显示
}
```
### HandleBtns 操作按钮
```
{
    label: '操作',
    componentsName: 'handle-btns',
    width: 194,
    handleFnName: '', // 自定义操作事件名 可不传
    showOverflowTooltip: false,
    // 操作传参示例
    handleBtns: [
      {
        id: 1, // 唯一值
        label: '查看基金账号', // 操作名称 不需要为空 可不传
        label1: '隐藏基金账号', // 操作之后改变名称 不需要为空 可不传
        isChange: false, // 是否改变名称
        tips: '该账户已销户',
        // prop: 'cancelFlag',
        // isStatus: 'Y',
        type: 'text', // btn类型
        icon: '', // 如果是icon操作 label不需要传
        className: '', // 重新定义样式,
        iconClassName: '', // icon,
        iconChangeName: '', // 切换icon
        isDiabledFn: (row, item) => {
          // item.tips = 'LCF' 改变tips提示
          return row['cancelFlag'] === 'Y'
        }
      },
      {
        id: 2,
        label: '详情',
        prop: 'cancelFlag',
        isStatus: 'Y',
        tips: '该账户已销户',
        type: 'text',
        icon: '',
        className: ''
      }
    ]
  }

```
### MoneyStr 金额处理
```
{
    label: '银行账号',
    prop: 'moneyName', // 金额字段名
    componentsName: 'money-str'// 金额组件名
}

```
### StatusName 状态处理
```
{
    label: '账户类型',
    prop: 'customerType', // 状态字段 
    componentsName: 'status-name', // 组件名称
    width: 100, // 宽度
    // 状态名称hash 匹配
    hashStatusName: {
        0: '机构',
        1: '个人',
        2: '产品'
    }
}
```
### MultiLineBox 多行展示处理 
```
{
    label: '注册登记机构',
    prop: 'registrationAgency', // 首行字段名
    prop1: 'registrationAgencyCode', // 次行字段名
    componentsName: 'multi-line-box', // 组件名
    propClassName: 'registrationAgency', // 样式类名
    align: 'left'
}
```
### 债券名称（代码）
```
{
    label: '债券名称（代码）',
    componentsName: 'CombineInLine',
    props: ['name', 'code'],
    joinStrs: ['（', '）']
}
```
### 日期范围
{
    label: 'xx日期',
    componentsName: 'DateRange',
    start: 'startTime', // 必填，开始时间后端字段名
    end: 'endTime', // 必填，结束时间后端字段名
    formatTemplate: 'YYYY-MM', // 可选 默认 YYYY-MM-DD
    nullValue: '长期有效', // 可选 默认 至今
    split: '到' // 可选 默认 ~
}
### 金额数字等
{
  label: '每份分红（元）',
  componentsName: 'NumberFormat',
  prop: 'perBouns',
  prefix: '每份派现金', // 可选 默认 ''
  unit: 'unit', // 可选 默认 '',填后端字段名
  suffix: '', // 可选 默认 ''
  multiply: 0.1, // 可选 乘以一个数值  默认 = 1
  precision: 4, // 可选 小数精度 默认=2， 为0时将四舍五入取整
  thousands: false, // 可选 是否添加千分号 默认false
  percent: false, // 可选 是否添加百分号 默认false
  nanText: '--', // 可选 无法显示数字时显示文字  默认为--
  color: true, // 可选 是否显示红色和绿色区分正负数，默认为false
  textAlign: 'center' // 可选 文字对齐方式
}
### 文档链接
{
    label: '文档链接',
    componentsName: 'cellLink',
    text1: 'pdfName', // 显示的文件名
    url1: 'pdfUrl', // 可选 文件链接 如果有url 则显示为链接 否则为文字
    text2: 'code', // 可选 第二行文件名  如果有则显示为双行
    url2: 'pdfUrl' // 可选 第二行链接 如果有url 则显示为链接 否则为文字
}
### 四分位排名
{
  label: '四分位排名',
  componentsName: 'QuartileRankings',
  prop: 'rank', // 排名对应的百分位，需要提前把值转为1-4，数字越高色块越多
  text: ['', '低风险', '中低风险', '中风险', '高风险'] // 可选，不正确的值和,1-4对应文字 默认为'', '不佳','一般', '良好', '优秀'
}
### 筛选
{
  label: '公告类型',
  allLabel: '公告类型', // 新增属性，必填 全选时显示的文字
  // 以下均为element原生属性
  prop: 'exampleText',
  columnKey: 'exampleType', // 用于过滤的值，加FilterKey作为key
  filterMultiple: false,
  filterPlacement: 'bottom',
  className: 'filter-th',
  // 下拉选项枚举
  filters: [
    { value: '1', text: '运作报告' },
    { value: '2', text: '法律文件' },
    { value: '3', text: '重大事项' },
    { value: '4', text: '基金产品资料概要' },
    { value: '5', text: '费用揭示' },
    { value: '6', text: '风险揭示书' },
    { value: '7', text: '其他' }
  ]
}
### 排序
{
  // 排序举例 以下均为element原生属性
  label: '开始时间',
  prop: 'startTime',
  sortable: 'custom' // 可后端排序,不支持同时过滤+排序
}

### 返回null显示指定字符
{
  label: '排名',
  prop: 'rank',
  componentsName: 'CellText',
  nullText: 'custom' // 可选， 默认 '--'
}

### 折扣费率
{
  label: '费率',
  prop: 'rate',
  componentsName: 'DiscountCell',
  discountValue: 'discountValue' // 折扣后显示的值，如果为null则不显示
}

### 天数汉化
{
  label: '累计任职天数',
  prop: 'curTenureDays',
  componentsName: 'FormatDay'
}

### 公告业务表格
{
  label: '公告标题',
  prop: 'title',
  componentsName: 'NoticeCell',
  align: 'left',
  headerAlign: 'center',
  url: 'fileLink' // 可选 文件链接 如果有url 则显示为链接 否则为文字
}