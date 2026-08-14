import { resolveDataSource } from './mode'
import { prepareClientRequest, clearClientRequest, getPendingClientRequest } from './idempotency'
import { prepareBatchTradeCommands, submitBatchTradeCommands } from './batch-trade'

const dataSource = resolveDataSource()
// Keep the compile-time environment expression inline so production builds
// can remove the provider tree for the other data source entirely.
const provider = process.env.VUE_APP_DATA_SOURCE === 'mock'
  ? require('./providers/mock').default
  : require('./providers/api').default

export const auth = provider.auth
export const dashboard = provider.dashboard
export const products = provider.products
export const holdings = provider.holdings
export const dividends = provider.dividends
export const statements = provider.statements
export const accounts = provider.accounts
export const help = provider.help
export const trades = {
  ...provider.trades,
  prepareClientRequest,
  clearClientRequest,
  getPendingClientRequest,
  prepareBatchCommands: prepareBatchTradeCommands,
  submitBatch: commands => submitBatchTradeCommands(commands, provider.trades.submit)
}

const intlService = { auth, dashboard, products, trades, holdings, dividends, statements, accounts, help, dataSource }

export { dataSource }
export default intlService
