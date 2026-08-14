export const DATA_SOURCES = Object.freeze({ MOCK: 'mock', API: 'api' })

export function resolveDataSource (value = process.env.VUE_APP_DATA_SOURCE) {
  const normalized = String(value || '').trim().toLowerCase()
  if (!Object.values(DATA_SOURCES).includes(normalized)) {
    throw new Error('VUE_APP_DATA_SOURCE must be explicitly set to mock or api')
  }
  return normalized
}

export function isMockMode () {
  return resolveDataSource() === DATA_SOURCES.MOCK
}

export function isApiMode () {
  return resolveDataSource() === DATA_SOURCES.API
}
