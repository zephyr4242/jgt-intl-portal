export function createMemoryStorage () {
  let values = {}
  return {
    getItem: key => Object.prototype.hasOwnProperty.call(values, key) ? values[key] : null,
    setItem: (key, value) => { values[key] = String(value) },
    removeItem: key => { delete values[key] },
    clear: () => { values = {} }
  }
}

export function resetBrowserState () {
  window.localStorage.clear()
  window.sessionStorage.clear()
  document.cookie.split(';').forEach(item => {
    const name = item.split('=')[0].trim()
    if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  })
}
