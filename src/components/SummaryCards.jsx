import { formatCurrency, formatNumber } from '../utils/formatters'

function KpiCard({ icon, label, value, sub, accent }) {
  return (
    <div className="kpi-card" style={accent ? { borderTop: `3px solid ${accent}` } : {}}>
      <span className="kpi-icon">{icon}</span>
      <span className="kpi-label">{label}</span>
      <span className={`kpi-value${accent === 'var(--success)' ? ' currency' : ''}`}>{value}</span>
      {sub && <span className="kpi-sub">{sub}</span>}
    </div>
  )
}

export default function SummaryCards({ summary, periodLabel }) {
  const { totalRecords, totalValue, uniqueCompanies, topCompany } = summary

  return (
    <div className="summary-section">
      <p className="section-label">Resumo — {periodLabel}</p>
      <div className="summary-grid">
        <KpiCard
          icon="📊"
          label="Total de Registros"
          value={formatNumber(totalRecords)}
          sub={`R$ ${(0.13).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por registro`}
          accent="var(--primary)"
        />
        <KpiCard
          icon="💰"
          label="Valor Total"
          value={formatCurrency(totalValue)}
          sub="0,13 × registros"
          accent="var(--success)"
        />
        <KpiCard
          icon="🏢"
          label="Empresas Ativas"
          value={formatNumber(uniqueCompanies)}
          sub="enviaram registros"
          accent="var(--warning)"
        />
        <KpiCard
          icon="🏆"
          label="Empresa Líder"
          value={topCompany?.name ?? '—'}
          sub={topCompany ? `${formatNumber(topCompany.records)} registros (${topCompany.pct.toFixed(1)}%)` : ''}
          accent="#7c3aed"
        />
      </div>
    </div>
  )
}
