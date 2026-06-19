export const SAMPLE_HEADERS = [
  'Data e Hora de Inserção',
  'Nome da Empresa',
  'CNPJ',
  'Tipo de Consulta',
  'Status',
]

export const SAMPLE_COLUMN_MAP = {
  dateTime: 'Data e Hora de Inserção',
  company:  'Nome da Empresa',
}

function row(daysAgo, h, m, company, cnpj, tipo, status) {
  const dt = new Date()
  dt.setDate(dt.getDate() - daysAgo)
  dt.setHours(h, m, 0, 0)
  const dateStr = dt.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' })
  return {
    'Data e Hora de Inserção': dateStr,
    'Nome da Empresa': company,
    'CNPJ': cnpj,
    'Tipo de Consulta': tipo,
    'Status': status,
    _dateTime: new Date(dt),
    _company:  company,
    _value:    0.13,
  }
}

export const SAMPLE_DATA = [
  row(0,  8, 14, 'Alpha Tecnologia Ltda',  '12.345.678/0001-90', 'Crédito',    'Aprovado'),
  row(0,  8, 32, 'Beta Sistemas S.A.',      '98.765.432/0001-11', 'Cadastro',   'Aprovado'),
  row(0,  9,  5, 'Alpha Tecnologia Ltda',  '12.345.678/0001-90', 'Crédito',    'Reprovado'),
  row(0,  9, 18, 'Gamma Solutions',         '11.222.333/0001-44', 'Cadastro',   'Aprovado'),
  row(0,  9, 45, 'Delta Corp',              '55.666.777/0001-88', 'Identidade', 'Aprovado'),
  row(0, 10, 22, 'Epsilon Inovações',       '33.444.555/0001-66', 'Crédito',    'Aprovado'),
  row(0, 10, 58, 'Beta Sistemas S.A.',      '98.765.432/0001-11', 'Identidade', 'Aprovado'),
  row(0, 11, 14, 'Alpha Tecnologia Ltda',  '12.345.678/0001-90', 'Cadastro',   'Aprovado'),
  row(0, 11, 30, 'Zeta Digital',            '77.888.999/0001-22', 'Crédito',    'Aprovado'),
  row(0, 13,  5, 'Gamma Solutions',         '11.222.333/0001-44', 'Crédito',    'Reprovado'),
  row(0, 13, 40, 'Alpha Tecnologia Ltda',  '12.345.678/0001-90', 'Identidade', 'Aprovado'),
  row(0, 14, 22, 'Delta Corp',              '55.666.777/0001-88', 'Cadastro',   'Aprovado'),
  row(0, 15,  0, 'Epsilon Inovações',       '33.444.555/0001-66', 'Cadastro',   'Aprovado'),
  row(0, 15, 45, 'Beta Sistemas S.A.',      '98.765.432/0001-11', 'Crédito',    'Aprovado'),
  row(0, 16, 10, 'Zeta Digital',            '77.888.999/0001-22', 'Identidade', 'Aprovado'),
  row(1,  8, 20, 'Alpha Tecnologia Ltda',  '12.345.678/0001-90', 'Crédito',    'Aprovado'),
  row(1,  9, 10, 'Gamma Solutions',         '11.222.333/0001-44', 'Cadastro',   'Aprovado'),
  row(1, 10, 35, 'Delta Corp',              '55.666.777/0001-88', 'Crédito',    'Reprovado'),
  row(1, 11, 50, 'Epsilon Inovações',       '33.444.555/0001-66', 'Identidade', 'Aprovado'),
  row(1, 14,  0, 'Beta Sistemas S.A.',      '98.765.432/0001-11', 'Cadastro',   'Aprovado'),
  row(2,  8, 55, 'Zeta Digital',            '77.888.999/0001-22', 'Crédito',    'Aprovado'),
  row(2,  9, 30, 'Alpha Tecnologia Ltda',  '12.345.678/0001-90', 'Cadastro',   'Aprovado'),
  row(2, 10, 45, 'Gamma Solutions',         '11.222.333/0001-44', 'Crédito',    'Aprovado'),
  row(2, 13, 20, 'Delta Corp',              '55.666.777/0001-88', 'Identidade', 'Aprovado'),
  row(3,  8, 10, 'Alpha Tecnologia Ltda',  '12.345.678/0001-90', 'Crédito',    'Aprovado'),
  row(3,  9, 40, 'Epsilon Inovações',       '33.444.555/0001-66', 'Cadastro',   'Aprovado'),
  row(3, 11,  5, 'Beta Sistemas S.A.',      '98.765.432/0001-11', 'Crédito',    'Aprovado'),
  row(3, 15, 30, 'Zeta Digital',            '77.888.999/0001-22', 'Cadastro',   'Reprovado'),
  row(4,  8, 50, 'Gamma Solutions',         '11.222.333/0001-44', 'Identidade', 'Aprovado'),
  row(4, 10, 25, 'Alpha Tecnologia Ltda',  '12.345.678/0001-90', 'Crédito',    'Aprovado'),
  row(5,  9, 15, 'Delta Corp',              '55.666.777/0001-88', 'Cadastro',   'Aprovado'),
  row(5, 14, 40, 'Epsilon Inovações',       '33.444.555/0001-66', 'Crédito',    'Aprovado'),
  row(6,  8, 30, 'Beta Sistemas S.A.',      '98.765.432/0001-11', 'Identidade', 'Aprovado'),
  row(6, 16,  0, 'Zeta Digital',            '77.888.999/0001-22', 'Crédito',    'Aprovado'),
].sort((a, b) => b._dateTime - a._dateTime)
