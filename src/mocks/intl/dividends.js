const text = (zhHans, zhHant, en) => ({ zhHans, zhHant, en })

export const dividends = [
  {
    dividendId: 'div-demo-001',
    tradeAccountId: 'TA-HK-001',
    fundId: 'FUND-HK-001',
    fundCode: 'INTL001',
    fundName: text('亚洲稳健收益基金', '亞洲穩健收益基金', 'Asia Stable Income Fund'),
    exDividendDate: '2026-05-08',
    recordDate: '2026-05-09',
    paymentDate: '2026-05-16',
    dividendPerUnit: '0.0825',
    eligibleShares: '12800.0000',
    dividendAmount: '1056.00',
    currency: 'HKD',
    status: 'PAID'
  },
  {
    dividendId: 'div-demo-002',
    tradeAccountId: 'TA-HK-001',
    fundId: 'FUND-HK-002',
    fundCode: 'INTL002',
    fundName: text('全球优选债券基金', '全球優選債券基金', 'Global Select Bond Fund'),
    exDividendDate: '2026-07-02',
    recordDate: '2026-07-03',
    paymentDate: null,
    dividendPerUnit: '0.0310',
    eligibleShares: '6200.0000',
    dividendAmount: '192.20',
    currency: 'USD',
    status: 'PAYING'
  },
  {
    dividendId: 'div-demo-003',
    tradeAccountId: 'TA-SG-002',
    fundId: 'FUND-HK-003',
    fundCode: 'INTL003',
    fundName: text('亚太股息精选基金', '亞太股息精選基金', 'Asia Pacific Dividend Select Fund'),
    exDividendDate: '2026-08-20',
    recordDate: '2026-08-21',
    paymentDate: null,
    dividendPerUnit: '0.0190',
    eligibleShares: '3800.0000',
    dividendAmount: '72.20',
    currency: 'USD',
    status: 'ANNOUNCED'
  }
]
