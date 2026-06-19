import { formatCurrency, formatNumber } from '../utils/formatters'

function KpiCard({ icon, label, value, sub, accentColor, valueClass }) {
  return (
    <div className="kpi-card" style={{ borderTopColor: accentColor }}>
      <span className="kpi-icon">{icon}</span>
      <span className="kpi-label">{label}</span>
      <span className={`kpi-value${valueClass ? ` ${valueClass}` : ''}`}>{value}</span>
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
          sub={`R$ 0,13 por registro`}
          accentColor="#001729"
        />
        <KpiCard
          icon="💰"
          label="Valor Total"
          value={formatCurrency(totalValue)}
          sub="0,13 × registros"
          accentColor="#9dd70f"
          valueClass="currency"
        />
        <KpiCard
          icon="🏢"
          label="Empresas Ativas"
          value={formatNumber(uniqueCompanies)}
          sub="enviaram registros"
          accentColor="#2b2e38"
        />
        <KpiCard
          icon="🏆"
          label="Empresa Líder"
          value={topCompany?.name ?? '—'}
          sub={topCompany ? `${formatNumber(topCompany.records)} reg. (${topCompany.pct.toFixed(1)}%)` : ''}
          accentColor="#9dd70f"
        />
      </div>
    </div>
  )
}
