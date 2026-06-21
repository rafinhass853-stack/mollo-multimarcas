import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { db, doc, getDoc, updateDoc, storage, ref, uploadBytes, getDownloadURL, deleteObject } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

function VeiculoEditar() {
  const { id } = useParams()
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
  const [imagemAtual, setImagemAtual] = useState('')
  const [novaImagem, setNovaImagem] = useState(null)
  const [preview, setPreview] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/admin')
      } else {
        carregarVeiculo()
      }
    })
    return () => unsubscribe()
  }, [id])

  const carregarVeiculo = async () => {
    try {
      const docRef = doc(db, "veiculos", id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setForm({
          nome: data.nome || '',
          ano: data.ano || '',
          preco: data.preco || '',
          km: data.km || '',
          cor: data.cor || '',
          descricao: data.descricao || '',
          fabricante: data.fabricante || '',
          motor: data.motor || '',
          cambio: data.cambio || '',
          combustivel: data.combustivel || ''
        })
        setImagemAtual(data.imagem || '')
      } else {
        alert('Veículo não encontrado!')
        navigate('/admin/veiculos')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('❌ Erro ao carregar veículo')
    } finally {
      setCarregando(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImagemChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNovaImagem(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSalvando(true)

    try {
      let imagemURL = imagemAtual

      // Se tiver nova imagem, fazer upload
      if (novaImagem) {
        // Deletar imagem antiga se existir
        if (imagemAtual) {
          try {
            const oldRef = ref(storage, imagemAtual)
            await deleteObject(oldRef)
          } catch (error) {
            console.log('Imagem antiga não encontrada ou já removida')
          }
        }

        // Upload nova imagem
        const storageRef = ref(storage, `veiculos/${Date.now()}_${novaImagem.name}`)
        const snapshot = await uploadBytes(storageRef, novaImagem)
        imagemURL = await getDownloadURL(snapshot.ref)
      }

      // Atualizar no Firestore
      const docRef = doc(db, "veiculos", id)
      await updateDoc(docRef, {
        ...form,
        preco: parseFloat(form.preco),
        ano: parseInt(form.ano),
        km: parseInt(form.km) || 0,
        imagem: imagemURL,
        dataAtualizacao: new Date().toISOString()
      })

      alert('✅ Veículo atualizado com sucesso!')
      navigate('/admin/veiculos')
    } catch (error) {
      console.error('Erro:', error)
      alert('❌ Erro ao atualizar veículo: ' + error.message)
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return <div style={styles.loading}>⏳ Carregando...</div>
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>✏️ Editar Veículo</h1>
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
                <button type="button" onClick={() => { setNovaImagem(null); setPreview(null) }} style={styles.removeImage}>
                  ✕
                </button>
              </div>
            ) : imagemAtual ? (
              <div style={styles.previewContainer}>
                <img src={imagemAtual} alt="Atual" style={styles.preview} />
                <button type="button" onClick={() => { setImagemAtual(''); setNovaImagem(null) }} style={styles.removeImage}>
                  ✕
                </button>
              </div>
            ) : (
              <div style={styles.dropArea}>
                <p>📤 Clique para selecionar uma nova imagem</p>
                <input type="file" accept="image/*" onChange={handleImagemChange} style={styles.fileInput} />
              </div>
            )}
          </div>
          <p style={styles.imageHint}>* Se não selecionar nova imagem, a atual será mantida</p>
        </div>

        <div style={styles.row}>
          <div style={{...styles.field, flex: 1}}>
            <label>Nome do Veículo *</label>
            <input type="text" name="nome" value={form.nome} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={{...styles.field, flex: 1}}>
            <label>Fabricante</label>
            <input type="text" name="fabricante" value={form.fabricante} onChange={handleChange} style={styles.input} />
          </div>
        </div>

        <div style={styles.row}>
          <div style={{...styles.field, flex: 1}}>
            <label>Ano *</label>
            <input type="number" name="ano" value={form.ano} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={{...styles.field, flex: 1}}>
            <label>Preço (R$) *</label>
            <input type="number" name="preco" value={form.preco} onChange={handleChange} required style={styles.input} />
          </div>
        </div>

        <div style={styles.row}>
          <div style={{...styles.field, flex: 1}}>
            <label>Quilometragem (km)</label>
            <input type="number" name="km" value={form.km} onChange={handleChange} style={styles.input} />
          </div>
          <div style={{...styles.field, flex: 1}}>
            <label>Cor *</label>
            <input type="text" name="cor" value={form.cor} onChange={handleChange} required style={styles.input} />
          </div>
        </div>

        <div style={styles.row}>
          <div style={{...styles.field, flex: 1}}>
            <label>Motor</label>
            <input type="text" name="motor" value={form.motor} onChange={handleChange} style={styles.input} />
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
          <textarea name="descricao" value={form.descricao} onChange={handleChange} style={styles.textarea} rows="4" />
        </div>

        <div style={styles.buttons}>
          <button type="submit" style={styles.btnSubmit} disabled={salvando}>
            {salvando ? '⏳ Salvando...' : '💾 Atualizar Veículo'}
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
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '24px'
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
  imageHint: {
    fontSize: '12px',
    color: '#666'
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  btnSubmit: {
    background: '#2196f3',
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

export default VeiculoEditar