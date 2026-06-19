import * as XLSX from 'xlsx'

const HINTS = {
  dateTime: ['data e hora', 'datahora', 'data_hora', 'data hora', 'inserção', 'insercao', 'datetime', 'timestamp', 'data/hora'],
  company:  ['nome da empresa', 'empresa', 'razão social', 'razao social', 'cliente', 'company', 'nome'],
}

function detectCol(headers, hints) {
  const lower = headers.map(h => h.toLowerCase().replace(/\s+/g, ' ').trim())
  for (const hint of hints) {
    const idx = lower.findIndex(h => h === hint || h.includes(hint) || hint.includes(h))
    if (idx !== -1) return headers[idx]
  }
  return null
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

        const detected = {
          dateTime: detectCol(headers, HINTS.dateTime),
          company:  detectCol(headers, HINTS.company),
        }

        resolve({
          headers,
          rows,
          detectedMap: (detected.dateTime && detected.company) ? detected : null,
        })
      } catch (e) {
        reject(e)
      }
    }
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo'))
    reader.readAsArrayBuffer(file)
  })
}

// Cada linha do Excel = 1 registro = R$ 0,13
export function processRows(rows, colMap) {
  return rows.map(row => {
    let dt = row[colMap.dateTime]

    if (typeof dt === 'string') {
      const m = dt.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/)
      if (m) {
        dt = new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0))
      } else {
        dt = new Date(dt)
      }
    }
    if (dt instanceof Date && isNaN(dt.getTime())) dt = null

    return {
      ...row,                                           // todas as colunas originais do Excel
      _dateTime: dt,                                    // data parseada
      _company:  String(row[colMap.company] ?? '').trim(),
      _value:    0.13,                                  // R$ 0,13 por linha
    }
  }).filter(r => r._company)
}
