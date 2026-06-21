import { useState } from 'react'

function Contato() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  })
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setEnviando(true)
    
    // Simular envio
    setTimeout(() => {
      setEnviando(false)
      setEnviado(true)
      setForm({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' })
      
      setTimeout(() => setEnviado(false), 5000)
    }, 1500)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📞 Fale Conosco</h1>
        <p style={styles.subtitle}>Estamos prontos para atender você!</p>
      </div>

      <div style={styles.content}>
        {/* Informações */}
        <div style={styles.info}>
          <div style={styles.infoCard}>
            <span style={styles.infoIcon}>📱</span>
            <h3 style={styles.infoTitle}>WhatsApp</h3>
            <p style={styles.infoText}>(11) 98888-8888</p>
            <a href="https://wa.me/5511988888888" style={styles.infoLink} target="_blank" rel="noopener noreferrer">
              Chamar agora →
            </a>
          </div>

          <div style={styles.infoCard}>
            <span style={styles.infoIcon}>📧</span>
            <h3 style={styles.infoTitle}>E-mail</h3>
            <p style={styles.infoText}>contato@mollomultimarcas.com</p>
            <a href="mailto:contato@mollomultimarcas.com" style={styles.infoLink}>
              Enviar e-mail →
            </a>
          </div>

          <div style={styles.infoCard}>
            <span style={styles.infoIcon}>📍</span>
            <h3 style={styles.infoTitle}>Endereço</h3>
            <p style={styles.infoText}>Av. Principal, 123</p>
            <p style={styles.infoText}>São Paulo - SP</p>
          </div>

          <div style={styles.infoCard}>
            <span style={styles.infoIcon}>🕐</span>
            <h3 style={styles.infoTitle}>Horário</h3>
            <p style={styles.infoText}>Seg-Sex: 8h às 18h</p>
            <p style={styles.infoText}>Sábado: 9h às 13h</p>
          </div>
        </div>

        {/* Formulário */}
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Envie uma mensagem</h2>
          
          {enviado && (
            <div style={styles.successMessage}>
              ✅ Mensagem enviada com sucesso! Entraremos em contato em breve.
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Nome *</label>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={form.nome}
                  onChange={(e) => setForm({...form, nome: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>E-mail *</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Telefone</label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={form.telefone}
                  onChange={(e) => setForm({...form, telefone: e.target.value})}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Assunto *</label>
                <select
                  value={form.assunto}
                  onChange={(e) => setForm({...form, assunto: e.target.value})}
                  style={styles.input}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="Comprar veículo">Comprar veículo</option>
                  <option value="Vender veículo">Vender veículo</option>
                  <option value="Agendar visita">Agendar visita</option>
                  <option value="Informações">Informações</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Mensagem *</label>
              <textarea
                placeholder="Digite sua mensagem..."
                value={form.mensagem}
                onChange={(e) => setForm({...form, mensagem: e.target.value})}
                style={styles.textarea}
                rows="5"
                required
              />
            </div>

            <button type="submit" style={styles.btnSubmit} disabled={enviando}>
              {enviando ? '⏳ Enviando...' : '📤 Enviar Mensagem'}
            </button>
          </form>
        </div>
      </div>

      {/* Mapa */}
      <div style={styles.mapContainer}>
        <h3 style={styles.mapTitle}>📍 Onde Estamos</h3>
        <div style={styles.mapPlaceholder}>
          <p style={styles.mapText}>🗺️ Mapa interativo</p>
          <p style={styles.mapSubtext}>Av. Principal, 123 - São Paulo/SP</p>
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
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '40px'
  },
  info: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    alignContent: 'start'
  },
  infoCard: {
    background: 'var(--white)',
    padding: '24px',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow-sm)',
    textAlign: 'center',
    transition: 'var(--transition)'
  },
  infoIcon: {
    fontSize: '32px',
    display: 'block',
    marginBottom: '10px'
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--primary)',
    marginBottom: '6px'
  },
  infoText: {
    fontSize: '14px',
    color: 'var(--text-light)',
    margin: '2px 0'
  },
  infoLink: {
    display: 'inline-block',
    marginTop: '8px',
    color: 'var(--accent)',
    fontWeight: 600,
    fontSize: '14px'
  },
  formContainer: {
    background: 'var(--white)',
    padding: '30px',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow)'
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--primary)',
    marginBottom: '20px'
  },
  successMessage: {
    background: 'var(--success)',
    color: 'var(--white)',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    animation: 'fadeIn 0.3s ease'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text)'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid var(--gray-200)',
    borderRadius: '8px',
    fontSize: '15px',
    background: 'var(--light)',
    transition: 'var(--transition)'
  },
  textarea: {
    padding: '12px 16px',
    border: '1px solid var(--gray-200)',
    borderRadius: '8px',
    fontSize: '15px',
    background: 'var(--light)',
    transition: 'var(--transition)',
    resize: 'vertical'
  },
  btnSubmit: {
    background: 'var(--primary)',
    color: 'var(--white)',
    padding: '14px 32px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 600,
    transition: 'var(--transition)',
    marginTop: '10px'
  },
  mapContainer: {
    marginTop: '40px',
    background: 'var(--white)',
    padding: '30px',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow-sm)',
    textAlign: 'center'
  },
  mapTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--primary)',
    marginBottom: '15px'
  },
  mapPlaceholder: {
    background: 'var(--gray-100)',
    padding: '60px 20px',
    borderRadius: 'var(--border-radius)',
    border: '2px dashed var(--gray-300)'
  },
  mapText: {
    fontSize: '24px',
    fontWeight: 600,
    color: 'var(--text-light)'
  },
  mapSubtext: {
    color: 'var(--gray-400)',
    marginTop: '10px'
  }
}

// Responsividade
const styleSheet = document.createElement("style")
styleSheet.textContent = `
  @media (max-width: 992px) {
    .contact-content {
      grid-template-columns: 1fr !important;
    }
    
    .info-grid {
      grid-template-columns: 1fr 1fr !important;
    }
  }
  
  @media (max-width: 768px) {
    .info-grid {
      grid-template-columns: 1fr !important;
    }
    
    .form-row {
      grid-template-columns: 1fr !important;
    }
  }
`
document.head.appendChild(styleSheet)

export default Contato