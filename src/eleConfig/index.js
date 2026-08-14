// 配置编译环境和线上环境之间的切换
const env = process.env

const config = {}

Object.assign(config, env)

export default config
