import { useState, useMemo } from 'react'
import { formatDateTime, formatNumber, formatCurrency } from '../utils/formatters'

const PAGE_SIZE = 15

export default function RecordsTable({ data, search, onSearch }) {
  const [sortKey, setSortKey] = useState('dateTime')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey]
      if (av instanceof Date) av = av?.getTime() ?? 0
      if (bv instanceof Date) bv = bv?.getTime() ?? 0
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const pageData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalRecords = data.reduce((s, r) => s + r.records, 0)
  const totalValue   = data.reduce((s, r) => s + r.value, 0)

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span className="sort-icon muted">⇅</span>
    return <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const Th = ({ col, children, align = 'left' }) => (
    <th
      className={`th-sort`}
      style={{ textAlign: align }}
      onClick={() => handleSort(col)}
    >
      {children} <SortIcon col={col} />
    </th>
  )

  return (
    <div className="card">
      <div className="card-header">
        <p className="card-title">Registros Detalhados</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            className="search-input"
            type="text"
            placeholder="Buscar empresa..."
            value={search}
            onChange={e => { onSearch(e.target.value); setPage(1) }}
          />
          <span className="result-count">{formatNumber(data.length)} registros</span>
        </div>
      </div>

      <div className="table-wrap">
        <table className="records-table">
          <thead>
            <tr>
              <Th col="dateTime">Data e Hora de Inserção</Th>
              <Th col="company">Nome da Empresa</Th>
              <Th col="records" align="right">Nº de Registros</Th>
              <Th col="value" align="right">Valor Total</Th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={4} className="td-empty">Nenhum registro encontrado</td>
              </tr>
            ) : pageData.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td>{formatDateTime(row.dateTime)}</td>
                <td>
                  <span className="company-badge">{row.company}</span>
                </td>
                <td className="td-right">{formatNumber(row.records)}</td>
                <td className="td-right value-cell">{formatCurrency(row.value)}</td>
              </tr>
            ))}
          </tbody>
          {data.length > 0 && (
            <tfoot>
              <tr className="tfoot-row">
                <td colSpan={2}><strong>Total ({formatNumber(data.length)} lotes)</strong></td>
                <td className="td-right"><strong>{formatNumber(totalRecords)}</strong></td>
                <td className="td-right value-cell"><strong>{formatCurrency(totalValue)}</strong></td>
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
