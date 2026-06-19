import { toDateInputValue } from '../utils/formatters'

const PERIODS = [
  { value: 'today',   label: 'Hoje' },
  { value: '7days',   label: 'Últimos 7 dias' },
  { value: '30days',  label: 'Últimos 30 dias' },
  { value: 'month',   label: 'Este mês' },
  { value: 'custom',  label: 'Período personalizado' },
  { value: 'all',     label: 'Todos' },
]

export default function DateFilter({ value, onChange, customRange, onCustomRange }) {
  const today = toDateInputValue(new Date())

  return (
    <div className="date-filter">
      <span className="filter-label">Período:</span>
      <div className="period-buttons">
        {PERIODS.map(p => (
          <button
            key={p.value}
            className={`period-btn ${value === p.value ? 'active' : ''}`}
            onClick={() => onChange(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>
      {value === 'custom' && (
        <div className="custom-range">
          <input
            type="date"
            max={today}
            value={customRange.start || ''}
            onChange={e => onCustomRange(r => ({ ...r, start: e.target.value }))}
            className="date-input"
          />
          <span>até</span>
          <input
            type="date"
            max={today}
            value={customRange.end || ''}
            onChange={e => onCustomRange(r => ({ ...r, end: e.target.value }))}
            className="date-input"
          />
        </div>
      )}
    </div>
  )
}
