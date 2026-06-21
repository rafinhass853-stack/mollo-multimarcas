import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db, collection, getDocs } from '../firebase'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [totalVeiculos, setTotalVeiculos] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/admin')
      } else {
        setUser(currentUser)
        carregarEstatisticas()
      }
    })
    return () => unsubscribe()
  }, [])

  const carregarEstatisticas = async () => {
    setCarregando(true)
    try {
      const querySnapshot = await getDocs(collection(db, "veiculos"))
      setTotalVeiculos(querySnapshot.size)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setCarregando(false)
    }
  }

  if (carregando) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Carregando dashboard...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Painel Administrativo</h1>
      
      <div style={styles.userInfo}>
        <p>👋 Bem-vindo, <strong>{user?.email}</strong></p>
      </div>

      {/* Cards */}
      <div style={styles.cards}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>🚗</div>
          <div>
            <h3 style={styles.cardNumber}>{totalVeiculos}</h3>
            <p style={styles.cardLabel}>Veículos Cadastrados</p>
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}>📅</div>
          <div>
            <h3 style={styles.cardNumber}>0</h3>
            <p style={styles.cardLabel}>Vendas Realizadas</p>
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}>👁️</div>
          <div>
            <h3 style={styles.cardNumber}>0</h3>
            <p style={styles.cardLabel}>Visualizações</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div style={styles.menu}>
        <h2 style={styles.menuTitle}>⚡ Ações Rápidas</h2>
        <div style={styles.menuGrid}>
          <Link to="/admin/veiculos" style={styles.menuItem}>
            <span style={styles.menuIcon}>📋</span>
            <span>Listar Veículos</span>
          </Link>
          <Link to="/admin/veiculos/novo" style={styles.menuItem}>
            <span style={styles.menuIcon}>➕</span>
            <span>Adicionar Veículo</span>
          </Link>
          <Link to="/" style={styles.menuItem}>
            <span style={styles.menuIcon}>🏠</span>
            <span>Ver Site</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  title: {
    fontSize: '32px',
    fontWeight: 800,
    color: 'var(--primary)',
    marginBottom: '20px'
  },
  userInfo: {
    background: 'var(--success)',
    color: 'var(--white)',
    padding: '15px 20px',
    borderRadius: 'var(--border-radius)',
    marginBottom: '30px'
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
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  card: {
    background: 'var(--white)',
    padding: '24px',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  cardIcon: {
    fontSize: '36px'
  },
  cardNumber: {
    fontSize: '28px',
    fontWeight: 800,
    color: 'var(--primary)',
    margin: 0
  },
  cardLabel: {
    margin: 0,
    color: 'var(--text-light)',
    fontSize: '14px'
  },
  menu: {
    background: 'var(--white)',
    padding: '30px',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow-sm)'
  },
  menuTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--primary)',
    marginBottom: '20px'
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px'
  },
  menuItem: {
    background: 'var(--light)',
    padding: '20px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: 'var(--primary)',
    textAlign: 'center',
    transition: 'var(--transition)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 600
  },
  menuIcon: {
    fontSize: '28px'
  }
}

export default Dashboard