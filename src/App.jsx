import { useState, useMemo, useCallback } from 'react'
import FileUpload from './components/FileUpload'
import ColumnMapper from './components/ColumnMapper'
import DateFilter from './components/DateFilter'
import SummaryCards from './components/SummaryCards'
import CompanyChart from './components/CompanyChart'
import RecordsTable from './components/RecordsTable'
import { parseExcelFile, processRows } from './utils/excelParser'
import { SAMPLE_DATA, SAMPLE_HEADERS, SAMPLE_COLUMN_MAP } from './utils/sampleData'
import './App.css'

const PERIOD_LABELS = {
  today:   'Hoje',
  '7days': 'Últimos 7 dias',
  '30days':'Últimos 30 dias',
  month:   'Este mês',
  custom:  'Período personalizado',
  all:     'Todos os registros',
}

function applyDateFilter(data, filter, range) {
  // Sem coluna de data detectada: não filtra
  if (data.length && data[0]._dateTime === null && filter !== 'all') return data

  const now   = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (filter === 'today') {
    return data.filter(r => r._dateTime && r._dateTime >= today)
  }
  if (filter === '7days') {
    const cut = new Date(today); cut.setDate(cut.getDate() - 6)
    return data.filter(r => r._dateTime && r._dateTime >= cut)
  }
  if (filter === '30days') {
    const cut = new Date(today); cut.setDate(cut.getDate() - 29)
    return data.filter(r => r._dateTime && r._dateTime >= cut)
  }
  if (filter === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    return data.filter(r => r._dateTime && r._dateTime >= start)
  }
  if (filter === 'custom' && range.start && range.end) {
    const s = new Date(range.start)
    const e = new Date(range.end); e.setHours(23, 59, 59, 999)
    return data.filter(r => r._dateTime && r._dateTime >= s && r._dateTime <= e)
  }
  return data
}

export default function App() {
  const [rawRows, setRawRows]               = useState(null)
  const [headers, setHeaders]               = useState([])
  const [columnMap, setColumnMap]           = useState(null)
  const [fileName, setFileName]             = useState('')
  const [error, setError]                   = useState('')
  const [loading, setLoading]               = useState(false)
  const [usingSample, setUsingSample]       = useState(false)
  const [showColumnConfig, setShowColumnConfig] = useState(false)
  const [dateFilter, setDateFilter]         = useState('all')
  const [customRange, setCustomRange]       = useState({ start: '', end: '' })
  const [search, setSearch]                 = useState('')

  const handleFile = useCallback(async (file) => {
    setLoading(true)
    setError('')
    setUsingSample(false)
    setShowColumnConfig(false)
    setSearch('')
    try {
      const { headers: h, rows, detectedMap } = await parseExcelFile(file)
      setFileName(file.name)
      setHeaders(h)
      setRawRows(rows)
      setColumnMap(detectedMap)          // sempre avança — detectedMap pode ter null parcial
      setDateFilter('all')               // exibe todos os registros ao carregar
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadSample = () => {
    setUsingSample(true)
    setError('')
    setRawRows(null)
    setFileName('')
    setShowColumnConfig(false)
    setSearch('')
    setDateFilter('7days')
    setHeaders(SAMPLE_HEADERS)
    setColumnMap(SAMPLE_COLUMN_MAP)
  }

  const resetDashboard = () => {
    setRawRows(null)
    setUsingSample(false)
    setFileName('')
    setColumnMap(null)
    setHeaders([])
    setError('')
    setSearch('')
    setShowColumnConfig(false)
    setDateFilter('all')
  }

  const processedData = useMemo(() => {
    if (usingSample) return SAMPLE_DATA
    if (!rawRows)    return []
    return processRows(rawRows, columnMap)
  }, [rawRows, columnMap, usingSample])

  const filteredData = useMemo(() => {
    const dateFiltered = applyDateFilter(processedData, dateFilter, customRange)
    if (!search.trim()) return dateFiltered
    const q = search.toLowerCase()
    return dateFiltered.filter(r =>
      headers.some(h => String(r[h] ?? '').toLowerCase().includes(q))
    )
  }, [processedData, dateFilter, customRange, search, headers])

  const summary = useMemo(() => {
    const totalRecords = filteredData.length
    const totalValue   = +(filteredData.length * 0.13).toFixed(2)

    const byCompany = {}
    for (const r of filteredData) {
      const co = r._company || '(sem empresa)'
      if (!byCompany[co]) byCompany[co] = { records: 0, value: 0 }
      byCompany[co].records += 1
      byCompany[co].value    = +(byCompany[co].value + 0.13).toFixed(2)
    }

    const companies = Object.entries(byCompany)
      .map(([name, s]) => ({
        name,
        ...s,
        pct: totalRecords > 0 ? (s.records / totalRecords) * 100 : 0,
      }))
      .sort((a, b) => b.records - a.records)

    return { totalRecords, totalValue, companies, topCompany: companies[0] ?? null, uniqueCompanies: companies.length }
  }, [filteredData])

  // O dashboard é mostrado assim que há dados — sem etapa de configuração obrigatória
  const hasData  = usingSample || rawRows != null
  const hasDate  = !!columnMap?.dateTime
  const hasCo    = !!columnMap?.company
  const allGood  = hasDate && hasCo

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo">X4</div>
        <div className="header-text">
          <h1>Dashboard de Registros</h1>
          <span className="header-sub">Tecnologia | IA — Controle de Envios</span>
        </div>
        {hasData && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button
              className={`btn ${showColumnConfig ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setShowColumnConfig(v => !v)}
              title="Configurar colunas"
            >
              ⚙️ Colunas
            </button>
            <button className="btn btn-ghost" onClick={resetDashboard}>↩ Trocar</button>
          </div>
        )}
      </header>

      <main className="main">
        {/* Tela inicial */}
        {!hasData && (
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

        {/* Dashboard — exibido imediatamente após carregar */}
        {hasData && (
          <>
            {usingSample && (
              <div className="status-msg info">
                🧪 Exibindo dados de exemplo — carregue sua planilha para ver dados reais
              </div>
            )}

            {/* Aviso não-bloqueante quando colunas não foram detectadas */}
            {!allGood && !showColumnConfig && (
              <div className="status-msg warning">
                ⚠️ {!hasDate && !hasCo
                  ? 'Colunas de data e empresa não identificadas automaticamente.'
                  : !hasDate ? 'Coluna de data não identificada — filtro por período desabilitado.'
                  : 'Coluna de empresa não identificada — gráfico de participação desabilitado.'}
                {' '}<button className="link-btn" onClick={() => setShowColumnConfig(true)}>Configurar agora</button>
              </div>
            )}

            {/* Painel de configuração de colunas (não-bloqueante) */}
            {showColumnConfig && (
              <ColumnMapper
                headers={headers}
                currentMap={columnMap}
                onConfirm={(map) => { setColumnMap(map); setShowColumnConfig(false) }}
                onCancel={() => setShowColumnConfig(false)}
              />
            )}

            {hasDate && (
              <DateFilter
                value={dateFilter}
                onChange={v => { setDateFilter(v); setSearch('') }}
                customRange={customRange}
                onCustomRange={setCustomRange}
              />
            )}

            <SummaryCards
              summary={summary}
              periodLabel={PERIOD_LABELS[dateFilter] ?? 'Todos'}
              totalInFile={processedData.length}
            />

            {hasCo && <CompanyChart companies={summary.companies} />}

            <RecordsTable
              data={filteredData}
              headers={headers}
              columnMap={columnMap}
              search={search}
              onSearch={setSearch}
            />
          </>
        )}
      </main>

      <footer className="footer">
        <span>Valor unitário: R$ 0,13 por linha</span>
        <span className="footer-dot">·</span>
        <span>Dashboard de Registros © {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}
