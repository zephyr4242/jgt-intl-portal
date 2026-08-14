import { readMockTable } from '@/mocks/intl/database'
import { withMockDelay } from '@/services/intl/result'

export default {
  getSummary () { return withMockDelay(readMockTable('dashboard')) }
}
