import accounts from '@/services/intl/providers/mock/accounts'

describe('international account profile boundary', () => {
  it('keeps organization and operator identity fields separate', async () => {
    const organization = await accounts.getOrganizationAccount()
    const operator = await accounts.getOperatorProfile()
    expect(organization).toEqual(expect.objectContaining({ organizationName: expect.any(String), tradeAccounts: expect.any(Array) }))
    expect(organization.operatorId).toBeUndefined()
    expect(operator).toEqual(expect.objectContaining({ operatorId: expect.any(String), locale: 'zh-Hans' }))
    expect(operator.tradeAccounts).toBeUndefined()
  })

  it('only permits supported locale updates', async () => {
    await expect(accounts.updateLocale('en')).resolves.toMatchObject({ locale: 'en' })
    await expect(accounts.updateLocale('fr')).rejects.toMatchObject({ code: 'LOCALE_UNSUPPORTED' })
  })
})
