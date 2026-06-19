export default function ColumnMapper({ headers, onConfirm }) {
  const fields = [
    { key: 'dateTime', label: 'Data e Hora de Inserção', icon: '📅', hint: 'coluna que contém a data/hora do registro' },
    { key: 'company',  label: 'Nome da Empresa',          icon: '🏢', hint: 'coluna que identifica a empresa' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const map = Object.fromEntries(fields.map(f => [f.key, fd.get(f.key)]))
    if (Object.values(map).some(v => !v)) {
      alert('Por favor, selecione uma coluna para cada campo obrigatório.')
      return
    }
    onConfirm(map)
  }

  return (
    <div className="card">
      <p className="card-title">Mapear Colunas da Planilha</p>
      <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: '0.875rem' }}>
        Não foi possível identificar automaticamente as colunas. Selecione quais correspondem a cada campo.
        Todas as outras colunas serão exibidas normalmente na tabela.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mapper-grid">
          {fields.map(({ key, label, icon, hint }) => (
            <div key={key} className="mapper-field">
              <label className="mapper-label">{icon} {label}</label>
              <select name={key} className="mapper-select" defaultValue="">
                <option value="" disabled>Selecione a coluna...</option>
                {headers.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{hint}</span>
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: 20 }}>
          Confirmar e Gerar Dashboard
        </button>
      </form>
    </div>
  )
}
