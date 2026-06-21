import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { db, collection, getDocs } from './firebase'

function TelaInicial() {
  const [destaques, setDestaques] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarDestaques = async () => {
      setLoading(true)
      try {
        const querySnapshot = await getDocs(collection(db, "veiculos"))
        const veiculos = []
        querySnapshot.forEach((doc) => {
          veiculos.push({ id: doc.id, ...doc.data() })
        })
        // Pegar os 3 mais recentes
        const recentes = veiculos.sort((a, b) => 
          (a.dataCadastro < b.dataCadastro ? 1 : -1)
        ).slice(0, 3)
        setDestaques(recentes)
      } catch (error) {
        console.error('Erro ao carregar destaques:', error)
      } finally {
        setLoading(false)
      }
    }
    carregarDestaques()
  }, [])

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.heroBadge}>🚗 Destaque</span>
          <h1 style={styles.heroTitle}>
            Encontre o Veículo <br />
            <span style={styles.heroHighlight}>dos Seus Sonhos</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Na Mollo Multimarcas, temos os melhores veículos seminovos com 
            procedência, garantia e as melhores condições de pagamento.
          </p>
          <div style={styles.heroButtons}>
            <Link to="/veiculos" style={styles.btnPrimary}>
              Ver Veículos
            </Link>
            <Link to="/contato" style={styles.btnSecondary}>
              Fale Conosco
            </Link>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.stat}>
              <span style={styles.statNumber}>10+</span>
              <span style={styles.statLabel}>Anos de Mercado</span>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.stat}>
              <span style={styles.statNumber}>500+</span>
              <span style={styles.statLabel}>Veículos Vendidos</span>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.stat}>
              <span style={styles.statNumber}>98%</span>
              <span style={styles.statLabel}>Clientes Satisfeitos</span>
            </div>
          </div>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.heroImagePlaceholder}>
            <span style={styles.heroImageIcon}>🚗</span>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section style={styles.destaques}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>⭐ Veículos em Destaque</h2>
          <Link to="/veiculos" style={styles.sectionLink}>Ver todos →</Link>
        </div>

        {loading ? (
          <div style={styles.loadingGrid}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{...styles.card, ...styles.cardSkeleton}}>
                <div style={styles.skeletonImage}></div>
                <div style={styles.skeletonText}></div>
                <div style={styles.skeletonText}></div>
                <div style={styles.skeletonText} style={{width: '60%'}}></div>
              </div>
            ))}
          </div>
        ) : destaques.length === 0 ? (
          <div style={styles.empty}>
            <span style={styles.emptyIcon}>🚗</span>
            <h3 style={styles.emptyTitle}>Nenhum veículo em destaque</h3>
            <p style={styles.emptyText}>Cadastre veículos no painel administrativo para aparecerem aqui.</p>
            <Link to="/admin/veiculos/novo" style={styles.btnPrimary}>Adicionar Veículo</Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {destaques.map((veiculo, index) => (
              <div key={veiculo.id} style={{...styles.card, animationDelay: `${index * 0.1}s`}} className="animate-fadeInUp">
                <div style={styles.cardImage}>
                  {veiculo.imagem ? (
                    <img src={veiculo.imagem} alt={veiculo.nome} style={styles.cardImg} />
                  ) : (
                    <div style={styles.cardImagePlaceholder}>🚗</div>
                  )}
                  <span style={styles.cardTag}>Destaque</span>
                </div>
                <div style={styles.cardBody}>
                  <h3 style={styles.cardTitle}>{veiculo.nome}</h3>
                  <div style={styles.cardDetails}>
                    <span>📅 {veiculo.ano}</span>
                    <span>📏 {veiculo.km?.toLocaleString()} km</span>
                    <span>🎨 {veiculo.cor}</span>
                  </div>
                  <p style={styles.cardPrice}>R$ {veiculo.preco?.toLocaleString()}</p>
                  <Link to="/veiculos" style={styles.cardBtn}>Ver Detalhes</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sobre */}
      <section style={styles.sobre}>
        <div style={styles.sobreContent}>
          <span style={styles.sobreBadge}>Sobre Nós</span>
          <h2 style={styles.sobreTitle}>Excelência em <span style={styles.heroHighlight}>Veículos Seminovos</span></h2>
          <p style={styles.sobreText}>
            Há mais de 10 anos, a <strong>Mollo Multimarcas</strong> é referência no mercado 
            de veículos seminovos. Trabalhamos com as melhores marcas e oferecemos 
            um atendimento personalizado para cada cliente.
          </p>
          <div style={styles.sobreGrid}>
            <div style={styles.sobreItem}>
              <span style={styles.sobreIcon}>✅</span>
              <div>
                <h4>Procedência</h4>
                <p>Todos os veículos com documentação regular</p>
              </div>
            </div>
            <div style={styles.sobreItem}>
              <span style={styles.sobreIcon}>🔧</span>
              <div>
                <h4>Garantia</h4>
                <p>Garantia de 3 meses em todos os veículos</p>
              </div>
            </div>
            <div style={styles.sobreItem}>
              <span style={styles.sobreIcon}>💰</span>
              <div>
                <h4>Financiamento</h4>
                <p>Condições especiais e taxas reduzidas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Pronto para encontrar seu veículo?</h2>
          <p style={styles.ctaText}>Venha nos visitar ou entre em contato para mais informações.</p>
          <Link to="/contato" style={styles.btnPrimaryLight}>Fale Conosco</Link>
        </div>
      </section>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    padding: '40px 0 60px',
    alignItems: 'center'
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  heroBadge: {
    background: 'var(--accent)',
    color: 'var(--white)',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 600,
    display: 'inline-block',
    width: 'fit-content'
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 900,
    lineHeight: 1.1,
    color: 'var(--primary)'
  },
  heroHighlight: {
    color: 'var(--accent)'
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'var(--text-light)',
    lineHeight: 1.8,
    maxWidth: '500px'
  },
  heroButtons: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  btnPrimary: {
    background: 'var(--primary)',
    color: 'var(--white)',
    padding: '14px 32px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '16px',
    border: 'none',
    transition: 'var(--transition)',
    textDecoration: 'none',
    display: 'inline-block'
  },
  btnPrimaryLight: {
    background: 'var(--white)',
    color: 'var(--primary)',
    padding: '14px 32px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '16px',
    border: 'none',
    transition: 'var(--transition)',
    textDecoration: 'none',
    display: 'inline-block'
  },
  btnSecondary: {
    background: 'transparent',
    color: 'var(--primary)',
    padding: '14px 32px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '16px',
    border: '2px solid var(--primary)',
    textDecoration: 'none',
    display: 'inline-block'
  },
  heroStats: {
    display: 'flex',
    gap: '30px',
    marginTop: '10px',
    paddingTop: '20px',
    borderTop: '1px solid var(--gray-200)'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column'
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: 800,
    color: 'var(--primary)'
  },
  statLabel: {
    fontSize: '14px',
    color: 'var(--text-light)'
  },
  statDivider: {
    width: '1px',
    background: 'var(--gray-200)'
  },
  heroImage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heroImagePlaceholder: {
    width: '100%',
    maxWidth: '500px',
    aspectRatio: '1',
    background: 'linear-gradient(135deg, var(--accent-light), var(--accent))',
    borderRadius: 'var(--border-radius-xl)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroImageIcon: {
    fontSize: '120px'
  },
  destaques: {
    padding: '40px 0'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: 800,
    color: 'var(--primary)'
  },
  sectionLink: {
    color: 'var(--accent)',
    fontWeight: 600
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px'
  },
  loadingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
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
  cardSkeleton: {
    padding: '20px'
  },
  skeletonImage: {
    height: '200px',
    background: 'var(--gray-200)',
    borderRadius: '8px',
    marginBottom: '15px',
    background: 'linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite'
  },
  skeletonText: {
    height: '20px',
    background: 'var(--gray-200)',
    borderRadius: '4px',
    marginBottom: '10px',
    background: 'linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite'
  },
  cardImage: {
    position: 'relative',
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
  cardTag: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'var(--accent)',
    color: 'var(--white)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600
  },
  cardBody: {
    padding: '20px'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '10px'
  },
  cardDetails: {
    display: 'flex',
    gap: '15px',
    fontSize: '14px',
    color: 'var(--text-light)',
    marginBottom: '12px',
    flexWrap: 'wrap'
  },
  cardPrice: {
    fontSize: '24px',
    fontWeight: 800,
    color: 'var(--accent)',
    marginBottom: '15px'
  },
  cardBtn: {
    display: 'inline-block',
    background: 'var(--primary)',
    color: 'var(--white)',
    padding: '10px 24px',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '14px',
    textDecoration: 'none',
    transition: 'var(--transition)'
  },
  sobre: {
    padding: '60px 0',
    background: 'var(--white)',
    borderRadius: 'var(--border-radius)',
    margin: '40px 0'
  },
  sobreContent: {
    padding: '0 40px'
  },
  sobreBadge: {
    background: 'var(--accent)',
    color: 'var(--white)',
    padding: '4px 14px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 600,
    display: 'inline-block'
  },
  sobreTitle: {
    fontSize: '32px',
    fontWeight: 800,
    color: 'var(--primary)',
    margin: '15px 0 20px'
  },
  sobreText: {
    fontSize: '18px',
    color: 'var(--text-light)',
    lineHeight: 1.8,
    maxWidth: '700px',
    marginBottom: '30px'
  },
  sobreGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px'
  },
  sobreItem: {
    display: 'flex',
    gap: '15px',
    alignItems: 'flex-start'
  },
  sobreIcon: {
    fontSize: '28px',
    flexShrink: 0
  },
  cta: {
    padding: '60px 20px',
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
    borderRadius: 'var(--border-radius)',
    textAlign: 'center',
    margin: '40px 0'
  },
  ctaContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px'
  },
  ctaTitle: {
    fontSize: '36px',
    fontWeight: 800,
    color: 'var(--white)'
  },
  ctaText: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.8)'
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
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
    color: 'var(--text-light)',
    marginBottom: '20px'
  }
}

// CSS adicional para animações e responsividade
const styleSheet = document.createElement("style")
styleSheet.textContent = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease forwards;
  }

  @media (max-width: 992px) {
    .hero-grid {
      grid-template-columns: 1fr !important;
      text-align: center;
    }
    
    .hero-stats {
      justify-content: center;
    }
    
    .hero-buttons {
      justify-content: center;
    }
    
    .hero-subtitle {
      margin: 0 auto;
    }
    
    .grid-3, .sobre-grid {
      grid-template-columns: 1fr 1fr !important;
    }
  }
  
  @media (max-width: 768px) {
    .grid-3, .sobre-grid {
      grid-template-columns: 1fr !important;
    }
    
    .hero-title {
      font-size: 32px !important;
    }
    
    .hero-image-placeholder {
      max-width: 300px !important;
    }
    
    .sobre-content {
      padding: 0 20px !important;
    }
    
    .cta-title {
      font-size: 28px !important;
    }
    
    .section-title {
      font-size: 24px !important;
    }
    
    .hero-stats {
      flex-direction: column;
      gap: 10px;
    }
    
    .stat-divider {
      display: none;
    }
  }
`
document.head.appendChild(styleSheet)

export default TelaInicial