import { getDashboardSummary } from '@/api/intl/dashboard'
import { createDomainError } from '@/services/intl/errors'

export default {
  async getSummary () {
    try { return await getDashboardSummary({}) } catch (e) { throw createDomainError(e) }
  }
}
