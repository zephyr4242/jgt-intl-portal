// 读取/bussiness/*/index.js文件，并校验是否有重复接口。
// 接口通过/getBaseUrl\('(.*)'\)/g 进行匹配
const fs = require('fs')
const path = require('path')

const ret = []
const pattern = /request.*getBaseUrl\('(.*)'\)/g

const folder = fs.readdirSync(path.join(__dirname, '/bussiness'))
folder.forEach(file => {
  const fileName = path.join(__dirname, '/bussiness/', file, '/index.js')
  console.log('正在读取文件：', fileName)
  let content = fs.readFileSync(fileName, { encoding: 'utf8', flag: 'r' })
  const result = content.matchAll(pattern)
  Array.from(result, x => {
    const p = x[0]
    if (ret.includes(p)) {
      console.log('发现重复path ===>', x[0])
    } else {
      ret.push(x[0])
    }
  })
})
