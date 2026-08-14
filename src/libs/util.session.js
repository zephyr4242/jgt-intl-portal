import cookies from '@/libs/util.cookies'

/**
 * 会话存储存取工具
 */
const session = {}
const jgtSessionStorageDefault = {
  // 公共数据
  public: {},
  // 区分用户
  user: {}
}
let jgtSessionStorage = {}

const getSession = (config = {}) => {
  // 获取sessionStorage数据
  let sessionData = sessionStorage.getItem('jgtSessionStorage')
  jgtSessionStorage = sessionData ? JSON.parse(sessionData) : jgtSessionStorageDefault
  // 区分用户
  if (config.user) {
    const uuid = cookies.get('uuid')
    if (!jgtSessionStorage.user[uuid]) {
      jgtSessionStorage.user[uuid] = {}
    }
    sessionData = jgtSessionStorage.user[uuid]
  } else {
    sessionData = jgtSessionStorage.public
  }
  return sessionData
}

session.get = (key, config) => {
  let sessionData = getSession(config)
  return sessionData[key] || ''
}
session.getAll = (config) => {
  return getSession(config) || {}
}
session.set = (key, value, config) => {
  let sessionData = getSession(config)
  sessionData[key] = value
  sessionStorage.setItem('jgtSessionStorage', JSON.stringify(jgtSessionStorage))
}

session.clear = () => {
  sessionStorage.setItem('jgtSessionStorage', '')
}

export default session
