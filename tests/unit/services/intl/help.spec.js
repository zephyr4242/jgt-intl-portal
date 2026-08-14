import help from '@/services/intl/providers/mock/help'

describe('international help mock provider', () => {
  it('filters by category, type and current-language keyword', async () => {
    const result = await help.list({
      categoryCode: 'TRADE',
      type: 'GUIDE',
      keyword: '赎回',
      locale: 'zh-Hans',
      page: 1,
      pageSize: 20
    })

    expect(result.total).toBe(1)
    expect(result.items[0]).toMatchObject({
      contentId: 'GUIDE-001',
      type: 'GUIDE',
      categoryCode: 'TRADE'
    })
  })

  it('returns a stable sort order and a consistent page result', async () => {
    const first = await help.list({ locale: 'en', page: 1, pageSize: 2 })
    const second = await help.list({ locale: 'en', page: 1, pageSize: 2 })

    expect(first).toMatchObject({ page: 1, pageSize: 2, total: 5 })
    expect(first.items.map(item => item.contentId)).toEqual(['FAQ-001', 'FAQ-002'])
    expect(second.items).toEqual(first.items)
  })

  it('does not fall back when the requested language is missing', async () => {
    const guide = await help.getGuide({ contentId: 'GUIDE-003', locale: 'en' })

    expect(guide.title).toBeNull()
    expect(guide.body).toBeNull()
    expect(guide.keywords).toEqual([])
  })

  it('keeps approved contact details available independently of search results', async () => {
    const empty = await help.list({ keyword: 'no-such-content', locale: 'en' })
    const contact = await help.getContact({ locale: 'en' })

    expect(empty.total).toBe(0)
    expect(contact.contact).toMatchObject({
      phone: '+852 3900-8888',
      email: 'hk.service@jiyufund.com',
      serviceTeam: 'Jiyu International Client Service'
    })
  })

  it('returns a localizable error for an unknown guide', async () => {
    await expect(help.getGuide({ contentId: 'UNKNOWN', locale: 'en' }))
      .rejects.toMatchObject({
        code: 'HELP_CONTENT_NOT_FOUND',
        messageKey: 'helpErrorNotFound',
        retryable: false
      })
  })
})
