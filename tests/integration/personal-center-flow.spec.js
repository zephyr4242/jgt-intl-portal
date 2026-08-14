jest.mock('@/services/intl', () => ({
  accounts: {
    getOperatorProfile: jest.fn(),
    updateLocale: jest.fn()
  }
}))

import { accounts } from '@/services/intl'
import PersonalCenter from '@/views/business/personal-center'

describe('personal center flow', () => {
  beforeEach(() => jest.clearAllMocks())

  it('persists a supported language through the account service', async () => {
    accounts.updateLocale.mockResolvedValue({ operatorId: 'operator-demo', locale: 'en' })
    const context = {
      savingLocale: false,
      profile: { operatorId: 'operator-demo', locale: 'zh-Hans' },
      savedLocale: 'zh-Hans',
      $message: { success: jest.fn(), error: jest.fn() },
      $store: { dispatch: jest.fn() },
      $t: key => key
    }
    await PersonalCenter.methods.saveLocale.call(context, 'en')
    expect(accounts.updateLocale).toHaveBeenCalledWith('en')
    expect(context.savedLocale).toBe('en')
    expect(context.$message.success).toHaveBeenCalled()
  })

  it('rolls the language back when persistence fails', async () => {
    accounts.updateLocale.mockRejectedValue({ messageKey: 'errors.saveFailed' })
    const context = {
      savingLocale: false,
      profile: { operatorId: 'operator-demo', locale: 'zh-Hans' },
      savedLocale: 'zh-Hans',
      $message: { success: jest.fn(), error: jest.fn() },
      $store: { dispatch: jest.fn().mockResolvedValue() },
      $t: key => key
    }
    await PersonalCenter.methods.saveLocale.call(context, 'en')
    expect(context.$store.dispatch).toHaveBeenCalledWith('d2admin/locale/set', 'zh-Hans')
  })

  it('clears the session through the shared logout action after confirmation', async () => {
    const context = {
      $confirm: jest.fn().mockResolvedValue(),
      $store: { dispatch: jest.fn().mockResolvedValue() },
      $t: key => key
    }
    await PersonalCenter.methods.logout.call(context)
    expect(context.$store.dispatch).toHaveBeenCalledWith('d2admin/account/logout', { confirm: false })
  })
})
