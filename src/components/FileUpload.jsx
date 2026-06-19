import { useRef, useState } from 'react'

export default function FileUpload({ onFile, fileName }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['xlsx', 'xls', 'ods'].includes(ext)) {
      alert('Por favor, selecione um arquivo Excel (.xlsx, .xls) ou ODS.')
      return
    }
    onFile(file)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div
      className={`upload-zone ${dragging ? 'dragging' : ''} ${fileName ? 'has-file' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.ods"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
      {fileName ? (
        <>
          <span className="upload-icon">✅</span>
          <span className="upload-text"><strong>{fileName}</strong></span>
          <span className="upload-hint">Clique para trocar o arquivo</span>
        </>
      ) : (
        <>
          <span className="upload-icon">📂</span>
          <span className="upload-text">Arraste um arquivo Excel aqui</span>
          <span className="upload-hint">ou clique para selecionar (.xlsx, .xls)</span>
        </>
      )}
    </div>
  )
}
