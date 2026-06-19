export default function ColumnMapper({ headers, currentMap, onConfirm, onCancel }) {
  const fields = [
    { key: 'dateTime', label: 'Data e Hora de Inserção', icon: '📅', hint: 'Usada para filtros por período' },
    { key: 'company',  label: 'Nome da Empresa',          icon: '🏢', hint: 'Usada para agrupar no gráfico' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const fd  = new FormData(e.target)
    const map = Object.fromEntries(fields.map(f => [f.key, fd.get(f.key) || null]))
    onConfirm(map)
  }

  return (
    <div className="card column-config-card">
      <div className="card-header">
        <p className="card-title">⚙️ Configurar Colunas</p>
        {onCancel && (
          <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.75rem' }} onClick={onCancel}>
            Fechar
          </button>
        )}
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: '0.8125rem' }}>
        Selecione quais colunas do arquivo correspondem aos campos abaixo.
        Os demais campos são opcionais e não impedem a visualização dos dados.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mapper-grid">
          {fields.map(({ key, label, icon, hint }) => (
            <div key={key} className="mapper-field">
              <label className="mapper-label">{icon} {label}</label>
              <select name={key} className="mapper-select" defaultValue={currentMap?.[key] ?? ''}>
                <option value="">(não identificado)</option>
                {headers.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{hint}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button type="submit" className="btn btn-primary">Aplicar</button>
          {onCancel && <button type="button" className="btn btn-outline" onClick={onCancel}>Cancelar</button>}
        </div>
      </form>
    </div>
  )
}
