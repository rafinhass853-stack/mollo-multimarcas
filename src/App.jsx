import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { auth, signOut } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import TelaInicial from './TelaInicial'
import AcessoRestrito from './acessorestrito'
import Veiculos from './veiculos'
import Contato from './contato'
import Dashboard from './admin/Dashboard'
import VeiculosLista from './admin/VeiculosLista'
import VeiculoNovo from './admin/VeiculoNovo'
import VeiculoEditar from './admin/VeiculoEditar'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      try {
        await signOut(auth)
        navigate('/')
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
        alert('❌ Erro ao fazer logout')
      }
    }
  }

  const isActive = (path) => location.pathname === path

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Carregando...</p>
      </div>
    )
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/" style={styles.logo}>
            <div style={styles.logoIcon}>🚗</div>
            <div>
              <h1 style={styles.logoText}>Mollo</h1>
              <span style={styles.logoSub}>Multimarcas</span>
            </div>
          </Link>

          <nav style={styles.nav}>
            <Link to="/" style={{...styles.navLink, ...(isActive('/') && styles.navLinkActive)}}>
              Início
            </Link>
            <Link to="/veiculos" style={{...styles.navLink, ...(isActive('/veiculos') && styles.navLinkActive)}}>
              Veículos
            </Link>
            <Link to="/contato" style={{...styles.navLink, ...(isActive('/contato') && styles.navLinkActive)}}>
              Contato
            </Link>
            
            {user ? (
              <>
                <Link to="/admin/dashboard" style={{...styles.navLink, ...(isActive('/admin/dashboard') && styles.navLinkActive), ...styles.navLinkAdmin}}>
                  ⚙️ Admin
                </Link>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  Sair
                </button>
              </>
            ) : (
              <Link to="/admin" style={{...styles.navLink, ...(isActive('/admin') && styles.navLinkActive)}}>
                Entrar
              </Link>
            )}
          </nav>

          <button style={styles.menuBtn} onClick={() => document.querySelector('nav').classList.toggle('open')}>
            ☰
          </button>
        </div>
      </header>

      {user && (
        <div style={styles.userStatus}>
          <span>✅ Logado como <strong>{user.email}</strong></span>
        </div>
      )}

      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<TelaInicial />} />
          <Route path="/veiculos" element={<Veiculos />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/admin" element={<AcessoRestrito />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/veiculos" element={<VeiculosLista />} />
          <Route path="/admin/veiculos/novo" element={<VeiculoNovo />} />
          <Route path="/admin/veiculos/editar/:id" element={<VeiculoEditar />} />
        </Routes>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>🚗 Mollo Multimarcas</h3>
            <p style={styles.footerText}>Excelência em veículos seminovos há mais de 10 anos.</p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Links Rápidos</h4>
            <Link to="/" style={styles.footerLink}>Início</Link>
            <Link to="/veiculos" style={styles.footerLink}>Veículos</Link>
            <Link to="/contato" style={styles.footerLink}>Contato</Link>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Contato</h4>
            <p style={styles.footerText}>📞 (11) 99999-9999</p>
            <p style={styles.footerText}>📧 contato@mollomultimarcas.com</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© 2024 Mollo Multimarcas - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  )
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'var(--light)'
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
    marginTop: '20px',
    color: 'var(--text-light)',
    fontSize: '18px'
  },
  header: {
    background: 'var(--primary)',
    color: 'var(--white)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: 'var(--shadow)'
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    color: 'var(--white)'
  },
  logoIcon: {
    fontSize: '32px',
    background: 'var(--accent)',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px'
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 800,
    letterSpacing: '-0.5px',
    margin: 0,
    lineHeight: 1.2
  },
  logoSub: {
    fontSize: '12px',
    fontWeight: 400,
    color: 'var(--accent)',
    letterSpacing: '2px',
    textTransform: 'uppercase'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  navLink: {
    color: 'var(--white)',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 500,
    transition: 'var(--transition)',
    textDecoration: 'none'
  },
  navLinkActive: {
    background: 'rgba(201, 168, 76, 0.2)',
    color: 'var(--accent)'
  },
  navLinkAdmin: {
    color: 'var(--accent)',
    fontWeight: 700
  },
  logoutBtn: {
    background: 'var(--danger)',
    color: 'var(--white)',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    marginLeft: '5px',
    transition: 'var(--transition)'
  },
  menuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: 'var(--white)',
    fontSize: '24px',
    cursor: 'pointer'
  },
  userStatus: {
    background: 'var(--success)',
    color: 'var(--white)',
    padding: '8px 20px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 500
  },
  main: {
    flex: 1,
    padding: '30px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  footer: {
    background: 'var(--primary)',
    color: 'var(--white)',
    padding: '40px 20px 0',
    marginTop: 'auto'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    paddingBottom: '30px',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  footerTitle: {
    fontSize: '20px',
    marginBottom: '10px'
  },
  footerSubtitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--accent)',
    marginBottom: '10px'
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    lineHeight: 1.6
  },
  footerLink: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    textDecoration: 'none',
    transition: 'var(--transition)'
  },
  footerBottom: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px 0',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px'
  }
}

// CSS para o menu mobile
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @media (max-width: 768px) {
    .nav-open {
      display: flex !important;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--primary);
      padding: 20px;
      gap: 10px !important;
      box-shadow: var(--shadow-lg);
    }
    
    nav .logout-btn {
      margin-left: 0 !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default App