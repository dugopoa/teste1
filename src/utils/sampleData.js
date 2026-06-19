const companies = [
  'Alpha Tecnologia Ltda',
  'Beta Sistemas S.A.',
  'Gamma Solutions',
  'Delta Corp',
  'Epsilon Inovações',
  'Zeta Digital',
]

function dateOffset(days, h, m) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(h, m, 0, 0)
  return d
}

export const SAMPLE_DATA = [
  { dateTime: dateOffset(0,  8, 14), company: 'Alpha Tecnologia Ltda',  records: 320 },
  { dateTime: dateOffset(0,  9, 30), company: 'Beta Sistemas S.A.',     records: 150 },
  { dateTime: dateOffset(0, 10,  5), company: 'Gamma Solutions',         records: 480 },
  { dateTime: dateOffset(0, 11, 22), company: 'Delta Corp',              records: 90  },
  { dateTime: dateOffset(0, 13, 45), company: 'Alpha Tecnologia Ltda',  records: 210 },
  { dateTime: dateOffset(0, 14, 10), company: 'Epsilon Inovações',      records: 560 },
  { dateTime: dateOffset(0, 15, 33), company: 'Beta Sistemas S.A.',     records: 200 },
  { dateTime: dateOffset(0, 16, 50), company: 'Zeta Digital',           records: 130 },
  { dateTime: dateOffset(1,  8, 20), company: 'Gamma Solutions',         records: 290 },
  { dateTime: dateOffset(1,  9, 55), company: 'Alpha Tecnologia Ltda',  records: 410 },
  { dateTime: dateOffset(1, 11,  0), company: 'Delta Corp',              records: 175 },
  { dateTime: dateOffset(1, 14, 30), company: 'Epsilon Inovações',      records: 340 },
  { dateTime: dateOffset(2,  8, 40), company: 'Beta Sistemas S.A.',     records: 260 },
  { dateTime: dateOffset(2, 10, 15), company: 'Zeta Digital',           records: 445 },
  { dateTime: dateOffset(2, 13, 20), company: 'Alpha Tecnologia Ltda',  records: 180 },
  { dateTime: dateOffset(3,  9,  5), company: 'Gamma Solutions',         records: 520 },
  { dateTime: dateOffset(3, 12, 45), company: 'Delta Corp',              records: 95  },
  { dateTime: dateOffset(3, 15, 10), company: 'Epsilon Inovações',      records: 380 },
  { dateTime: dateOffset(4,  8, 30), company: 'Alpha Tecnologia Ltda',  records: 290 },
  { dateTime: dateOffset(4, 11, 20), company: 'Beta Sistemas S.A.',     records: 310 },
  { dateTime: dateOffset(5,  9, 45), company: 'Zeta Digital',           records: 220 },
  { dateTime: dateOffset(5, 14,  0), company: 'Gamma Solutions',         records: 460 },
  { dateTime: dateOffset(6,  8, 10), company: 'Epsilon Inovações',      records: 500 },
  { dateTime: dateOffset(6, 16, 30), company: 'Delta Corp',              records: 140 },
].map(r => ({ ...r, value: +(r.records * 0.13).toFixed(2) }))
  .sort((a, b) => b.dateTime - a.dateTime)
