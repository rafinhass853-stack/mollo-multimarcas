import { useState, useEffect } from 'react'
import { db, collection, getDocs } from './firebase'

function Veiculos() {
  const [veiculos, setVeiculos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [filtro, setFiltro] = useState('')
  const [precoMax, setPrecoMax] = useState('')
  const [filtroAno, setFiltroAno] = useState('')

  useEffect(() => {
    carregarVeiculos()
  }, [])

  const carregarVeiculos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "veiculos"))
      const veiculosList = []
      querySnapshot.forEach((doc) => {
        veiculosList.push({ id: doc.id, ...doc.data() })
      })
      setVeiculos(veiculosList)
    } catch (error) {
      console.error('Erro ao carregar veículos:', error)
    } finally {
      setCarregando(false)
    }
  }

  const veiculosFiltrados = veiculos.filter(veiculo => {
    const matchNome = veiculo.nome?.toLowerCase().includes(filtro.toLowerCase()) || false
    const matchPreco = precoMax ? veiculo.preco <= parseInt(precoMax) : true
    const matchAno = filtroAno ? veiculo.ano === parseInt(filtroAno) : true
    return matchNome && matchPreco && matchAno
  })

  const anos = [...new Set(veiculos.map(v => v.ano))].sort((a, b) => b - a)

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
        <h1 style={styles.title}>🚗 Nossos Veículos</h1>
        <p style={styles.subtitle}>{veiculos.length} veículos disponíveis</p>
      </div>

      {/* Filtros */}
      <div style={styles.filtros}>
        <div style={styles.filtroGroup}>
          <input
            type="text"
            placeholder="🔍 Buscar veículo..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.filtroGroup}>
          <input
            type="number"
            placeholder="💰 Preço máximo"
            value={precoMax}
            onChange={(e) => setPrecoMax(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.filtroGroup}>
          <select value={filtroAno} onChange={(e) => setFiltroAno(e.target.value)} style={styles.select}>
            <option value="">Todos os anos</option>
            {anos.map(ano => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>
        </div>
        <span style={styles.total}>
          {veiculosFiltrados.length} {veiculosFiltrados.length === 1 ? 'veículo' : 'veículos'} encontrados
        </span>
      </div>

      {/* Listagem */}
      {veiculosFiltrados.length === 0 ? (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>🔍</span>
          <h3 style={styles.emptyTitle}>Nenhum veículo encontrado</h3>
          <p style={styles.emptyText}>Tente ajustar os filtros de busca</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {veiculosFiltrados.map((veiculo, index) => (
            <div key={veiculo.id} style={{...styles.card, animationDelay: `${index * 0.05}s`}} className="animate-fadeInUp">
              <div style={styles.cardImage}>
                {veiculo.imagem ? (
                  <img src={veiculo.imagem} alt={veiculo.nome} style={styles.cardImg} />
                ) : (
                  <div style={styles.cardImagePlaceholder}>🚗</div>
                )}
              </div>
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{veiculo.nome}</h3>
                <div style={styles.cardDetails}>
                  <span>📅 {veiculo.ano}</span>
                  <span>📏 {veiculo.km?.toLocaleString()} km</span>
                  <span>🎨 {veiculo.cor}</span>
                </div>
                {veiculo.descricao && (
                  <p style={styles.cardDesc}>{veiculo.descricao.substring(0, 80)}...</p>
                )}
                <p style={styles.cardPrice}>R$ {veiculo.preco?.toLocaleString()}</p>
                <button style={styles.cardBtn} onClick={() => window.location.href = '/contato'}>
                  📞 Solicitar Informações
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
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '40px',
    fontWeight: 900,
    color: 'var(--primary)',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '18px',
    color: 'var(--text-light)'
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
    color: 'var(--text-light)'
  },
  filtros: {
    display: 'flex',
    gap: '15px',
    marginBottom: '40px',
    flexWrap: 'wrap',
    background: 'var(--white)',
    padding: '20px',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow-sm)'
  },
  filtroGroup: {
    flex: 1,
    minWidth: '180px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid var(--gray-200)',
    borderRadius: '8px',
    fontSize: '15px',
    background: 'var(--light)',
    transition: 'var(--transition)'
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid var(--gray-200)',
    borderRadius: '8px',
    fontSize: '15px',
    background: 'var(--light)',
    transition: 'var(--transition)',
    appearance: 'none'
  },
  total: {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-light)',
    fontSize: '14px',
    fontWeight: 500,
    padding: '0 10px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '30px'
  },
  card: {
    background: 'var(--white)',
    borderRadius: 'var(--border-radius)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow)',
    transition: 'var(--transition)',
    opacity: 0
  },
  cardImage: {
    height: '220px',
    overflow: 'hidden',
    background: 'var(--gray-100)'
  },
  cardImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'var(--transition)'
  },
  cardImagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '60px',
    color: 'var(--gray-300)'
  },
  cardBody: {
    padding: '20px'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '8px'
  },
  cardDetails: {
    display: 'flex',
    gap: '12px',
    fontSize: '14px',
    color: 'var(--text-light)',
    marginBottom: '10px',
    flexWrap: 'wrap'
  },
  cardDesc: {
    fontSize: '14px',
    color: 'var(--text-light)',
    marginBottom: '12px',
    lineHeight: 1.5
  },
  cardPrice: {
    fontSize: '26px',
    fontWeight: 800,
    color: 'var(--accent)',
    marginBottom: '15px'
  },
  cardBtn: {
    width: '100%',
    background: 'var(--primary)',
    color: 'var(--white)',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 600,
    transition: 'var(--transition)'
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'var(--white)',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow-sm)'
  },
  emptyIcon: {
    fontSize: '48px',
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
    color: 'var(--text-light)'
  }
}

// CSS adicional
const styleSheet = document.createElement("style")
styleSheet.textContent = `
  @media (max-width: 768px) {
    .filtros {
      flex-direction: column;
    }
    
    .filtro-group {
      min-width: 100% !important;
    }
    
    .total {
      justify-content: center;
    }
  }
`
document.head.appendChild(styleSheet)

export default Veiculos