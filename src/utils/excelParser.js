import * as XLSX from 'xlsx'

const HINTS = {
  dateTime: ['data e hora', 'datahora', 'data_hora', 'data hora', 'inserção', 'insercao',
             'datetime', 'timestamp', 'data/hora', 'dt inserção', 'dt_insercao', 'data'],
  company:  ['nome da empresa', 'empresa', 'razão social', 'razao social', 'cliente',
             'company', 'nome empresa', 'fornecedor', 'parceiro'],
}

function detectCol(headers, hints) {
  const lower = headers.map(h => h.toLowerCase().replace(/\s+/g, ' ').trim())
  for (const hint of hints) {
    const idx = lower.findIndex(h => h === hint || h.includes(hint) || hint.includes(h))
    if (idx !== -1) return headers[idx]
  }
  return null
}

// Tenta detectar a coluna de data analisando os valores das células
function detectDateColByValues(headers, rows) {
  const sample = rows.slice(0, Math.min(10, rows.length))
  for (const h of headers) {
    const vals = sample.map(r => r[h]).filter(v => v != null)
    if (vals.length === 0) continue
    // Células que já vieram como Date (cellDates: true)
    if (vals.some(v => v instanceof Date && !isNaN(v))) return h
    // Strings no formato dd/mm/yyyy ou yyyy-mm-dd
    if (vals.some(v => typeof v === 'string' &&
        (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(v) || /^\d{4}-\d{2}-\d{2}/.test(v)))) return h
  }
  return null
}

// Tenta detectar coluna de empresa por cardinalidade dos valores (repetições típicas de empresa)
function detectCompanyColByValues(headers, rows, skipCol) {
  const sample = rows.slice(0, Math.min(30, rows.length))
  let bestCol = null
  let bestScore = Infinity

  for (const h of headers) {
    if (h === skipCol) continue
    const vals = sample.map(r => String(r[h] ?? '').trim()).filter(Boolean)
    if (vals.length === 0) continue
    // Ignora colunas numéricas
    if (vals.every(v => !isNaN(parseFloat(v)))) continue
    // Ignora colunas com todos valores únicos (provavelmente IDs)
    const unique = new Set(vals).size
    const ratio  = unique / vals.length
    // Queremos coluna com repetições (0.05 < ratio < 0.85) e textos longos (>3 chars)
    if (ratio > 0.05 && ratio < 0.85 && vals.every(v => v.length > 2)) {
      // Prefere o menor número de valores únicos (mais concentrado = mais empresa)
      if (unique < bestScore) { bestScore = unique; bestCol = h }
    }
  }
  return bestCol
}

export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = ({ target: { result } }) => {
      try {
        const wb = XLSX.read(new Uint8Array(result), { type: 'array', cellDates: true })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null })

        if (!raw || raw.length < 2) throw new Error('Planilha vazia ou sem dados')

        const headers = raw[0].map(h => String(h ?? '').trim()).filter(Boolean)
        const rows = raw
          .slice(1)
          .filter(r => r.some(c => c != null && c !== ''))
          .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? null])))

        // Detecção em duas camadas: nome da coluna → valores das células
        const dateTimeByName = detectCol(headers, HINTS.dateTime)
        const companyByName  = detectCol(headers, HINTS.company)

        const dateTimeCol = dateTimeByName ?? detectDateColByValues(headers, rows)
        const companyCol  = companyByName  ?? detectCompanyColByValues(headers, rows, dateTimeCol)

        resolve({
          headers,
          rows,
          detectedMap: {
            dateTime: dateTimeCol,
            company:  companyCol,
          },
        })
      } catch (e) {
        reject(e)
      }
    }
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo'))
    reader.readAsArrayBuffer(file)
  })
}

// Cada linha = 1 registro = R$ 0,13
export function processRows(rows, colMap) {
  return rows.map(row => {
    let dt = colMap?.dateTime ? row[colMap.dateTime] : null

    if (typeof dt === 'string') {
      const m = dt.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/)
      if (m) dt = new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0))
      else    dt = new Date(dt)
    }
    if (dt instanceof Date && isNaN(dt.getTime())) dt = null

    return {
      ...row,
      _dateTime: dt,
      _company:  colMap?.company ? String(row[colMap.company] ?? '').trim() : '',
      _value:    0.13,
    }
  })
}
