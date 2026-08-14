import { PRODUCTS } from './products'
import { HOLDINGS } from './holdings'
import { INITIAL_TRADES } from './trades'
import { dividends } from './dividends'
import { statements } from './statements'
import { organizationAccount, operatorProfile } from './accounts'
import { DASHBOARD_SUMMARY } from './dashboard'

export const MOCK_DATABASE_KEY = 'jgt-intl-mock-database-v2'
const MOCK_DATABASE_VERSION = 2

const clone = value => JSON.parse(JSON.stringify(value))

function createInitialDatabase () {
  return {
    version: MOCK_DATABASE_VERSION,
    products: clone(PRODUCTS),
    holdings: clone(HOLDINGS),
    trades: clone(INITIAL_TRADES),
    dividends: clone(dividends),
    statements: clone(statements),
    organizationAccount: clone(organizationAccount),
    operatorProfile: clone(operatorProfile),
    dashboard: clone(DASHBOARD_SUMMARY)
  }
}

let memoryDatabase = createInitialDatabase()

function getStorage () {
  try {
    return typeof window !== 'undefined' && window.localStorage ? window.localStorage : null
  } catch (error) {
    return null
  }
}

function readStoredDatabase () {
  const storage = getStorage()
  if (!storage) return null
  try {
    const database = JSON.parse(storage.getItem(MOCK_DATABASE_KEY) || 'null')
    return database && database.version === MOCK_DATABASE_VERSION ? database : null
  } catch (error) {
    return null
  }
}

function persist (database) {
  memoryDatabase = clone(database)
  const storage = getStorage()
  if (storage) storage.setItem(MOCK_DATABASE_KEY, JSON.stringify(memoryDatabase))
  return clone(memoryDatabase)
}

export function ensureMockDatabase () {
  const stored = readStoredDatabase()
  return stored ? persist(stored) : persist(createInitialDatabase())
}

export function readMockTable (table) {
  const database = readStoredDatabase() || memoryDatabase || ensureMockDatabase()
  return clone(database[table])
}

export function writeMockTable (table, value) {
  const database = readStoredDatabase() || memoryDatabase || createInitialDatabase()
  database[table] = clone(value)
  persist(database)
  return clone(database[table])
}

export function resetMockDatabase () {
  return persist(createInitialDatabase())
}
