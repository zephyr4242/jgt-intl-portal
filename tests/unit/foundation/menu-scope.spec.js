import getMenu from '@/menu/aside'

function flatten (items) {
  return items.reduce((all, item) => all.concat(item, flatten(item.children || [])), [])
}

describe('international portal menu scope', () => {
  it('contains only approved reachable entries', () => {
    const entries = flatten(getMenu())
    const paths = entries.filter(item => !(item.children || []).length).map(item => item.path)
    expect(paths).toEqual(expect.arrayContaining([
      '/index', '/fund/product/list', '/trade-info/aggregation/index',
      '/account/my-assets', '/account/trade-records', '/account/dividend-records',
      '/account/bill', '/account/list', '/personal-center/my-permission',
      '/personal-center/password-edit', '/personal-center/download-records',
      '/personal-center/login-logs', '/help-center'
    ]))
    expect(paths.join(' ')).not.toMatch(/pi|report|guide|detail|inquiry/i)
    entries.forEach(item => expect(item.titleKey).toBeTruthy())
  })
})
