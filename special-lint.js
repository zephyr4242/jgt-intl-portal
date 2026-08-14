const fs = require("fs")
const chalk = require("chalk")
const packageJsonData = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const {
  dependencies
} = packageJsonData
let flag = false

const args = process.argv.slice(2);

Object.values(dependencies).forEach(val => {
  if (flag) return
  if (val.includes("~") || val.includes("^")) {
    flag = true
  }
})
if (flag) {
  console.log(
    `${chalk.red.white(" ERROR ")} ${chalk.bold.red(
        `无效的commit提交`
      )}\n\n` +
    chalk.red(
      `请检查package.json, 确认生产npm包版本已锁定`
    )
  )
  const lintType = args[0]
  if (lintType === 'commitlint') {
    process.exit(1) //调用 process.exit() 将强制进程尽快退出，即使仍有未完全完成的异步操作挂起
  }
  throw Error('请检查package.json, 确认生产npm包版本已锁定')
}
