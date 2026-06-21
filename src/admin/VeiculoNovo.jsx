import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { db, collection, addDoc, storage, ref, uploadBytes, getDownloadURL } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

function VeiculoNovo() {
  const [form, setForm] = useState({
    nome: '',
    ano: '',
    preco: '',
    km: '',
    cor: '',
    descricao: '',
    fabricante: '',
    motor: '',
    cambio: '',
    combustivel: ''
  })
  const [imagem, setImagem] = useState(null)
  const [preview, setPreview] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/admin')
      }
    })
    return () => unsubscribe()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImagemChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagem(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCarregando(true)
    setUploadProgress(0)

    try {
      let imagemURL = ''

      if (imagem) {
        const storageRef = ref(storage, `veiculos/${Date.now()}_${imagem.name}`)
        const snapshot = await uploadBytes(storageRef, imagem)
        imagemURL = await getDownloadURL(snapshot.ref)
        setUploadProgress(100)
      }

      const dados = {
        ...form,
        preco: parseFloat(form.preco),
        ano: parseInt(form.ano),
        km: parseInt(form.km) || 0,
        imagem: imagemURL || '',
        dataCadastro: new Date().toISOString()
      }

      await addDoc(collection(db, "veiculos"), dados)
      alert('✅ Veículo adicionado com sucesso!')
      navigate('/admin/veiculos')
    } catch (error) {
      console.error('Erro:', error)
      alert('❌ Erro ao adicionar veículo: ' + error.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>➕ Adicionar Veículo</h1>
        <Link to="/admin/veiculos" style={styles.btnVoltar}>← Voltar</Link>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Upload Imagem */}
        <div style={styles.field}>
          <label>📸 Foto do Veículo</label>
          <div style={styles.uploadArea}>
            {preview ? (
              <div style={styles.previewContainer}>
                <img src={preview} alt="Preview" style={styles.preview} />
                <button type="button" onClick={() => { setImagem(null); setPreview(null) }} style={styles.removeImage}>
                  ✕
                </button>
              </div>
            ) : (
              <div style={styles.dropArea}>
                <p>📤 Clique para selecionar uma imagem</p>
                <input type="file" accept="image/*" onChange={handleImagemChange} style={styles.fileInput} />
              </div>
            )}
          </div>
        </div>

        <div style={styles.row}>
          <div style={{...styles.field, flex: 1}}>
            <label>Nome do Veículo *</label>
            <input type="text" name="nome" value={form.nome} onChange={handleChange} required style={styles.input} placeholder="Ex: Fiat Uno" />
          </div>
          <div style={{...styles.field, flex: 1}}>
            <label>Fabricante</label>
            <input type="text" name="fabricante" value={form.fabricante} onChange={handleChange} style={styles.input} placeholder="Ex: Fiat" />
          </div>
        </div>

        <div style={styles.row}>
          <div style={{...styles.field, flex: 1}}>
            <label>Ano *</label>
            <input type="number" name="ano" value={form.ano} onChange={handleChange} required style={styles.input} placeholder="2020" />
          </div>
          <div style={{...styles.field, flex: 1}}>
            <label>Preço (R$) *</label>
            <input type="number" name="preco" value={form.preco} onChange={handleChange} required style={styles.input} placeholder="45000" />
          </div>
        </div>

        <div style={styles.row}>
          <div style={{...styles.field, flex: 1}}>
            <label>Quilometragem (km)</label>
            <input type="number" name="km" value={form.km} onChange={handleChange} style={styles.input} placeholder="30000" />
          </div>
          <div style={{...styles.field, flex: 1}}>
            <label>Cor *</label>
            <input type="text" name="cor" value={form.cor} onChange={handleChange} required style={styles.input} placeholder="Branco" />
          </div>
        </div>

        <div style={styles.row}>
          <div style={{...styles.field, flex: 1}}>
            <label>Motor</label>
            <input type="text" name="motor" value={form.motor} onChange={handleChange} style={styles.input} placeholder="1.0 Flex" />
          </div>
          <div style={{...styles.field, flex: 1}}>
            <label>Câmbio</label>
            <select name="cambio" value={form.cambio} onChange={handleChange} style={styles.input}>
              <option value="">Selecione...</option>
              <option value="Manual">Manual</option>
              <option value="Automático">Automático</option>
              <option value="CVT">CVT</option>
              <option value="Automático Sequencial">Automático Sequencial</option>
            </select>
          </div>
        </div>

        <div style={styles.field}>
          <label>Combustível</label>
          <select name="combustivel" value={form.combustivel} onChange={handleChange} style={styles.input}>
            <option value="">Selecione...</option>
            <option value="Flex">Flex</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Diesel">Diesel</option>
            <option value="Elétrico">Elétrico</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>

        <div style={styles.field}>
          <label>Descrição</label>
          <textarea name="descricao" value={form.descricao} onChange={handleChange} style={styles.textarea} placeholder="Descrição detalhada do veículo..." rows="4" />
        </div>

        <div style={styles.buttons}>
          <button type="submit" style={styles.btnSubmit} disabled={carregando}>
            {carregando ? '⏳ Salvando...' : '💾 Salvar Veículo'}
          </button>
          <Link to="/admin/veiculos" style={styles.btnCancelar}>Cancelar</Link>
        </div>
      </form>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  btnVoltar: {
    color: '#666',
    textDecoration: 'none'
  },
  form: {
    background: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  row: {
    display: 'flex',
    gap: '20px'
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px'
  },
  textarea: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    resize: 'vertical'
  },
  uploadArea: {
    border: '2px dashed #ddd',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    minHeight: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dropArea: {
    width: '100%',
    position: 'relative'
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer'
  },
  previewContainer: {
    position: 'relative',
    display: 'inline-block'
  },
  preview: {
    maxHeight: '200px',
    borderRadius: '10px'
  },
  removeImage: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    background: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  btnSubmit: {
    background: '#4caf50',
    color: 'white',
    padding: '15px 30px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    flex: 1
  },
  btnCancelar: {
    background: '#666',
    color: 'white',
    padding: '15px 30px',
    border: 'none',
    borderRadius: '5px',
    textDecoration: 'none',
    textAlign: 'center',
    flex: 1
  }
}

export default VeiculoNovo