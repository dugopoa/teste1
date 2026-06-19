import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts'
import { formatNumber, formatCurrency, formatPercent } from '../utils/formatters'

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#db2777', '#65a30d', '#ea580c', '#4f46e5']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="chart-tooltip">
      <strong>{d.name}</strong>
      <div>Registros: {formatNumber(d.records)}</div>
      <div>Valor: {formatCurrency(d.value)}</div>
      <div>Participação: {d.pct.toFixed(1)}%</div>
    </div>
  )
}

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, pct }) => {
  if (pct < 5) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * Math.PI / 180)
  const y = cy + r * Math.sin(-midAngle * Math.PI / 180)
  return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>{pct.toFixed(1)}%</text>
}

export default function CompanyChart({ companies }) {
  const [chartType, setChartType] = useState('bar')
  const top10 = companies.slice(0, 10)

  return (
    <div className="card">
      <div className="card-header">
        <p className="card-title">Participação por Empresa</p>
        <div className="chart-toggle">
          <button className={`toggle-btn ${chartType === 'bar' ? 'active' : ''}`} onClick={() => setChartType('bar')}>Barras</button>
          <button className={`toggle-btn ${chartType === 'pie' ? 'active' : ''}`} onClick={() => setChartType('pie')}>Pizza</button>
        </div>
      </div>

      {top10.length === 0 ? (
        <div className="empty-chart">Sem dados para o período selecionado</div>
      ) : chartType === 'bar' ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={top10} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize: 11 }} interval={0} />
            <YAxis tickFormatter={formatNumber} tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="records" radius={[4, 4, 0, 0]}>
              {top10.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={top10}
              dataKey="records"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              labelLine={false}
              label={renderCustomLabel}
            >
              {top10.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(v) => v} wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}

      <div className="company-list">
        {top10.map((c, i) => (
          <div key={c.name} className="company-row">
            <span className="company-rank" style={{ background: COLORS[i % COLORS.length] }}>{i + 1}</span>
            <span className="company-name">{c.name}</span>
            <div className="company-bar-wrap">
              <div className="company-bar-fill" style={{ width: `${c.pct}%`, background: COLORS[i % COLORS.length] }} />
            </div>
            <span className="company-pct">{c.pct.toFixed(1)}%</span>
            <span className="company-records">{formatNumber(c.records)} reg.</span>
            <span className="company-value">{formatCurrency(c.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
