import { useState, useMemo } from 'react'
import { formatDateTime, formatNumber, formatCurrency } from '../utils/formatters'

const PAGE_SIZE = 15
const VALUE_PER_ROW = 0.13

export default function RecordsTable({ data, headers, columnMap, search, onSearch }) {
  const dateTimeCol = columnMap?.dateTime ?? null

  // Default sort: date descending
  const [sortKey, setSortKey] = useState('_dateTime')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage]       = useState(1)

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  // Map header click → internal sort key
  const sortKeyFor = (header) => header === dateTimeCol ? '_dateTime' : header

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      let av = sortKey === '_dateTime' ? (a._dateTime?.getTime() ?? 0) : String(a[sortKey] ?? '').toLowerCase()
      let bv = sortKey === '_dateTime' ? (b._dateTime?.getTime() ?? 0) : String(b[sortKey] ?? '').toLowerCase()

      // Try numeric comparison for non-date columns
      if (sortKey !== '_dateTime') {
        const an = parseFloat(av), bn = parseFloat(bv)
        if (!isNaN(an) && !isNaN(bn)) { av = an; bv = bn }
      }

      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const pageData   = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalValue = data.length * VALUE_PER_ROW

  const SortIcon = ({ col }) => {
    const key = sortKeyFor(col)
    if (sortKey !== key) return <span className="sort-icon muted">⇅</span>
    return <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const Th = ({ col, align = 'left', children }) => (
    <th className="th-sort" style={{ textAlign: align }} onClick={() => handleSort(sortKeyFor(col))}>
      {children ?? col} <SortIcon col={col} />
    </th>
  )

  const cellValue = (row, header) => {
    if (header === dateTimeCol) return formatDateTime(row._dateTime)
    const v = row[header]
    if (v == null) return '—'
    if (v instanceof Date) return formatDateTime(v)
    return String(v)
  }

  return (
    <div className="card">
      <div className="card-header">
        <p className="card-title">Registros Detalhados</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            className="search-input"
            type="text"
            placeholder="Filtrar..."
            value={search}
            onChange={e => { onSearch(e.target.value); setPage(1) }}
          />
          <span className="result-count">{formatNumber(data.length)} linhas</span>
        </div>
      </div>

      <div className="table-wrap">
        <table className="records-table">
          <thead>
            <tr>
              {headers.map(h => <Th key={h} col={h}>{h}</Th>)}
              <th style={{ textAlign: 'right', minWidth: 110 }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr><td colSpan={headers.length + 1} className="td-empty">Nenhum registro encontrado</td></tr>
            ) : pageData.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                {headers.map(h => (
                  <td key={h} className={h === dateTimeCol ? '' : ''}>
                    {h === columnMap?.company
                      ? <span className="company-badge">{cellValue(row, h)}</span>
                      : cellValue(row, h)
                    }
                  </td>
                ))}
                <td className="td-right value-cell">{formatCurrency(VALUE_PER_ROW)}</td>
              </tr>
            ))}
          </tbody>
          {data.length > 0 && (
            <tfoot>
              <tr className="tfoot-row">
                <td colSpan={Math.max(1, headers.length)}>
                  <strong>Total — {formatNumber(data.length)} registros</strong>
                </td>
                <td className="td-right value-cell">
                  <strong>{formatCurrency(totalValue)}</strong>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
          <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
          <span className="page-info">Página {page} de {totalPages}</span>
          <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
          <button className="page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
        </div>
      )}
    </div>
  )
}
