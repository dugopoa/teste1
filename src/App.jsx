import { useState, useMemo, useCallback } from 'react'
import FileUpload from './components/FileUpload'
import ColumnMapper from './components/ColumnMapper'
import DateFilter from './components/DateFilter'
import SummaryCards from './components/SummaryCards'
import CompanyChart from './components/CompanyChart'
import RecordsTable from './components/RecordsTable'
import { parseExcelFile, processRows } from './utils/excelParser'
import { SAMPLE_DATA } from './utils/sampleData'
import './App.css'

const PERIOD_LABELS = {
  today: 'Hoje',
  '7days': 'Últimos 7 dias',
  '30days': 'Últimos 30 dias',
  month: 'Este mês',
  custom: 'Período personalizado',
  all: 'Todos os registros',
}

function applyDateFilter(data, filter, range) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (filter === 'today') {
    return data.filter(r => r.dateTime && r.dateTime >= today)
  }
  if (filter === '7days') {
    const cut = new Date(today); cut.setDate(cut.getDate() - 6)
    return data.filter(r => r.dateTime && r.dateTime >= cut)
  }
  if (filter === '30days') {
    const cut = new Date(today); cut.setDate(cut.getDate() - 29)
    return data.filter(r => r.dateTime && r.dateTime >= cut)
  }
  if (filter === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    return data.filter(r => r.dateTime && r.dateTime >= start)
  }
  if (filter === 'custom' && range.start && range.end) {
    const s = new Date(range.start)
    const e = new Date(range.end); e.setHours(23, 59, 59, 999)
    return data.filter(r => r.dateTime && r.dateTime >= s && r.dateTime <= e)
  }
  return data
}

export default function App() {
  const [rawRows, setRawRows]             = useState(null)
  const [headers, setHeaders]             = useState([])
  const [columnMap, setColumnMap]         = useState(null)
  const [needsMapping, setNeedsMapping]   = useState(false)
  const [fileName, setFileName]           = useState('')
  const [error, setError]                 = useState('')
  const [loading, setLoading]             = useState(false)
  const [usingSample, setUsingSample]     = useState(false)
  const [dateFilter, setDateFilter]       = useState('today')
  const [customRange, setCustomRange]     = useState({ start: '', end: '' })
  const [search, setSearch]               = useState('')

  const handleFile = useCallback(async (file) => {
    setLoading(true)
    setError('')
    setNeedsMapping(false)
    setColumnMap(null)
    setUsingSample(false)
    try {
      const { headers, rows, detectedMap } = await parseExcelFile(file)
      setFileName(file.name)
      setHeaders(headers)
      setRawRows(rows)
      if (detectedMap) {
        setColumnMap(detectedMap)
      } else {
        setNeedsMapping(true)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleColumnConfirm = useCallback((map) => {
    setColumnMap(map)
    setNeedsMapping(false)
  }, [])

  const loadSample = () => {
    setUsingSample(true)
    setError('')
    setNeedsMapping(false)
    setColumnMap(null)
    setRawRows(null)
    setFileName('')
    setDateFilter('7days')
  }

  const resetDashboard = () => {
    setRawRows(null)
    setUsingSample(false)
    setFileName('')
    setColumnMap(null)
    setNeedsMapping(false)
    setError('')
  }

  const processedData = useMemo(() => {
    if (usingSample) return SAMPLE_DATA
    if (!rawRows || !columnMap) return []
    return processRows(rawRows, columnMap)
  }, [rawRows, columnMap, usingSample])

  const filteredData = useMemo(() => {
    const dateFiltered = applyDateFilter(processedData, dateFilter, customRange)
    if (!search.trim()) return dateFiltered
    const q = search.toLowerCase()
    return dateFiltered.filter(r => r.company.toLowerCase().includes(q))
  }, [processedData, dateFilter, customRange, search])

  const summary = useMemo(() => {
    const totalRecords = filteredData.reduce((s, r) => s + r.records, 0)
    const totalValue   = filteredData.reduce((s, r) => s + r.value, 0)

    const byCompany = {}
    for (const r of filteredData) {
      if (!byCompany[r.company]) byCompany[r.company] = { records: 0, value: 0 }
      byCompany[r.company].records += r.records
      byCompany[r.company].value   += r.value
    }

    const companies = Object.entries(byCompany)
      .map(([name, s]) => ({ name, ...s, pct: totalRecords > 0 ? (s.records / totalRecords) * 100 : 0 }))
      .sort((a, b) => b.records - a.records)

    return {
      totalRecords,
      totalValue,
      companies,
      topCompany: companies[0] ?? null,
      uniqueCompanies: companies.length,
    }
  }, [filteredData])

  const hasData = usingSample || (rawRows && columnMap)

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo">X4</div>
        <div className="header-text">
          <h1>Dashboard de Registros</h1>
          <span className="header-sub">Tecnologia | IA — Controle de Envios</span>
        </div>
        {hasData && (
          <button className="btn btn-ghost" onClick={resetDashboard}>
            ↩ Trocar arquivo
          </button>
        )}
      </header>

      <main className="main">
        {!hasData && !needsMapping && (
          <div className="welcome">
            <FileUpload onFile={handleFile} fileName={fileName} />
            {loading && <div className="status-msg loading">⏳ Lendo planilha...</div>}
            {error   && <div className="status-msg error">❌ {error}</div>}
            <div className="divider"><span>ou</span></div>
            <button className="btn btn-outline" onClick={loadSample}>
              🧪 Usar dados de exemplo
            </button>
          </div>
        )}

        {needsMapping && (
          <ColumnMapper headers={headers} onConfirm={handleColumnConfirm} />
        )}

        {hasData && (
          <>
            {usingSample && (
              <div className="status-msg info">
                🧪 Exibindo dados de exemplo — carregue sua planilha para ver dados reais
              </div>
            )}

            <DateFilter
              value={dateFilter}
              onChange={v => { setDateFilter(v); setSearch('') }}
              customRange={customRange}
              onCustomRange={setCustomRange}
            />

            <SummaryCards summary={summary} periodLabel={PERIOD_LABELS[dateFilter]} />

            <CompanyChart companies={summary.companies} />

            <RecordsTable data={filteredData} search={search} onSearch={setSearch} />
          </>
        )}
      </main>

      <footer className="footer">
        <span>Valor unitário: R$ 0,13 por registro</span>
        <span className="footer-dot">·</span>
        <span>Dashboard de Registros © {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}
