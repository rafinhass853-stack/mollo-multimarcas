import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { db, collection, getDocs, deleteDoc, doc } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

function VeiculosLista() {
  const [veiculos, setVeiculos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/admin')
      } else {
        carregarVeiculos()
      }
    })
    return () => unsubscribe()
  }, [])

  const carregarVeiculos = async () => {
    setCarregando(true) // Garantir que começa como true
    try {
      const querySnapshot = await getDocs(collection(db, "veiculos"))
      const veiculosList = []
      querySnapshot.forEach((doc) => {
        veiculosList.push({ id: doc.id, ...doc.data() })
      })
      veiculosList.sort((a, b) => (a.dataCadastro < b.dataCadastro ? 1 : -1))
      setVeiculos(veiculosList)
    } catch (error) {
      console.error('Erro ao carregar veículos:', error)
      alert('❌ Erro ao carregar veículos')
    } finally {
      setCarregando(false) // Sempre finalizar o loading
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      try {
        await deleteDoc(doc(db, "veiculos", id))
        alert('✅ Veículo excluído com sucesso!')
        carregarVeiculos() // Recarregar a lista
      } catch (error) {
        console.error('Erro ao excluir:', error)
        alert('❌ Erro ao excluir veículo')
      }
    }
  }

  if (carregando) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Carregando veículos...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📋 Meus Veículos</h1>
          <p style={styles.total}>{veiculos.length} veículos cadastrados</p>
        </div>
        <Link to="/admin/veiculos/novo" style={styles.btnAdd}>➕ Adicionar Veículo</Link>
      </div>

      {veiculos.length === 0 ? (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>🚗</span>
          <h3 style={styles.emptyTitle}>Nenhum veículo cadastrado</h3>
          <p style={styles.emptyText}>Comece adicionando seu primeiro veículo!</p>
          <Link to="/admin/veiculos/novo" style={styles.btnAddEmpty}>
            ➕ Adicionar primeiro veículo
          </Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {veiculos.map(veiculo => (
            <div key={veiculo.id} style={styles.card}>
              <div style={styles.cardImage}>
                {veiculo.imagem ? (
                  <img src={veiculo.imagem} alt={veiculo.nome} style={styles.imagem} />
                ) : (
                  <div style={styles.semImagem}>🚗</div>
                )}
              </div>
              <h3 style={styles.cardTitle}>{veiculo.nome}</h3>
              <div style={styles.detalhes}>
                <span>📅 {veiculo.ano}</span>
                <span>📏 {veiculo.km?.toLocaleString()} km</span>
                <span>🎨 {veiculo.cor}</span>
              </div>
              <p style={styles.preco}>R$ {veiculo.preco?.toLocaleString()}</p>
              
              <div style={styles.acoes}>
                <Link to={`/admin/veiculos/editar/${veiculo.id}`} style={styles.btnEditar}>
                  ✏️ Editar
                </Link>
                <button onClick={() => handleDelete(veiculo.id)} style={styles.btnDeletar}>
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 800,
    color: 'var(--primary)',
    marginBottom: '5px'
  },
  total: {
    color: 'var(--text-light)',
    fontSize: '15px'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px'
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '4px solid var(--gray-200)',
    borderTop: '4px solid var(--accent)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '15px',
    color: 'var(--text-light)',
    fontSize: '16px'
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'var(--white)',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow-sm)'
  },
  emptyIcon: {
    fontSize: '64px',
    display: 'block',
    marginBottom: '15px'
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--primary)',
    marginBottom: '8px'
  },
  emptyText: {
    color: 'var(--text-light)',
    marginBottom: '20px'
  },
  btnAdd: {
    background: 'var(--primary)',
    color: 'var(--white)',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'var(--transition)'
  },
  btnAddEmpty: {
    display: 'inline-block',
    background: 'var(--primary)',
    color: 'var(--white)',
    padding: '14px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'var(--transition)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px'
  },
  card: {
    background: 'var(--white)',
    borderRadius: 'var(--border-radius)',
    padding: '20px',
    boxShadow: 'var(--shadow)',
    transition: 'var(--transition)'
  },
  cardImage: {
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
    background: 'var(--gray-100)',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  imagem: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  semImagem: {
    fontSize: '60px',
    color: 'var(--gray-300)'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '8px'
  },
  detalhes: {
    display: 'flex',
    justifyContent: 'space-around',
    fontSize: '14px',
    color: 'var(--text-light)',
    marginBottom: '10px'
  },
  preco: {
    fontSize: '24px',
    fontWeight: 800,
    color: 'var(--accent)',
    margin: '10px 0'
  },
  acoes: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center'
  },
  btnEditar: {
    background: 'var(--info)',
    color: 'var(--white)',
    padding: '8px 20px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'var(--transition)'
  },
  btnDeletar: {
    background: 'var(--danger)',
    color: 'var(--white)',
    padding: '8px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'var(--transition)'
  }
}

export default VeiculosLista