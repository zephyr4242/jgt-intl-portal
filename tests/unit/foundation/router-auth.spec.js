import fs from 'fs'
import path from 'path'

describe('international protected routes', () => {
  it('protects every formal business child via its parent route', () => {
    const source = fs.readFileSync(path.resolve(__dirname, '../../../src/router/routes.js'), 'utf8')
    expect(source).toMatch(/path:\s*['"]\/['"][\s\S]{0,160}meta:\s*\{\s*auth:\s*true\s*\}/)
    ;['index', 'fund/product/list', 'trade-info/aggregation/index', 'account/my-assets',
      'account/trade-records', 'account/dividend-records', 'account/bill', 'account/list',
      'personal-center', 'help-center']
      .forEach(routePath => expect(source).toContain(`path: '${routePath}'`))
  })
})
