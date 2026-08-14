function getIco(type) {
  let ico = ''
  switch (process.env.VUE_APP_ENV) {
    case 'development':
      ico = 'client_development.' + type
      break
    case 'test':
      ico = 'client_test.' + type
      break
    case 'uat':
      ico = 'client_uat.' + type
      break
    case 'production':
      ico = 'client.' + type
      break
    default:
      ico = 'client.' + type
  }
  return ico
}

module.exports = getIco
