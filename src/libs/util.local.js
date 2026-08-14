import cookies from '@/libs/util.cookies'

/**
 * 本地存储存取工具
 */
const local = {}
const jgtLocalStorageDefault = {
  // 公共数据
  public: {},
  // 区分用户
  user: {}
}
let jgtLocalStorage = {}

const getLocal = (config = {}) => {
  // 获取localStorage数据
  let localData = localStorage.getItem('jgtLocalStorage')
  jgtLocalStorage = localData ? JSON.parse(localData) : jgtLocalStorageDefault
  // 区分用户
  if (config.user) {
    const uuid = cookies.get('uuid')
    if (!jgtLocalStorage.user[uuid]) {
      jgtLocalStorage.user[uuid] = {}
    }
    localData = jgtLocalStorage.user[uuid]
  } else {
    localData = jgtLocalStorage.public
  }
  return localData
}

local.get = (key, config) => {
  let localData = getLocal(config)
  return localData[key] || ''
}

local.set = (key, value, config) => {
  let localData = getLocal(config)
  localData[key] = value
  localStorage.setItem('jgtLocalStorage', JSON.stringify(jgtLocalStorage))
}

local.clear = () => {
  localStorage.setItem('jgtLocalStorage', '')
}

export default local
