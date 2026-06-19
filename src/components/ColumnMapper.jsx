export default function ColumnMapper({ headers, onConfirm }) {
  const fields = [
    { key: 'dateTime', label: 'Data e Hora de Inserção', icon: '📅' },
    { key: 'company',  label: 'Nome da Empresa',          icon: '🏢' },
    { key: 'records',  label: 'Número de Registros',      icon: '🔢' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const map = Object.fromEntries(fields.map(f => [f.key, fd.get(f.key)]))
    if (Object.values(map).some(v => !v)) {
      alert('Por favor, selecione uma coluna para cada campo.')
      return
    }
    onConfirm(map)
  }

  return (
    <div className="card">
      <p className="card-title">Mapear Colunas da Planilha</p>
      <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: '0.875rem' }}>
        Não conseguimos identificar as colunas automaticamente. Selecione quais colunas correspondem a cada campo:
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mapper-grid">
          {fields.map(({ key, label, icon }) => (
            <div key={key} className="mapper-field">
              <label className="mapper-label">{icon} {label}</label>
              <select name={key} className="mapper-select" defaultValue="">
                <option value="" disabled>Selecione a coluna...</option>
                {headers.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }}>
          Confirmar e Gerar Dashboard
        </button>
      </form>
    </div>
  )
}
