import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, signInWithEmailAndPassword } from './firebase'

function AcessoRestrito() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha)
      console.log('Usuário logado:', userCredential.user.email)
      navigate('/admin/dashboard')
    } catch (error) {
      console.error('Erro no login:', error)
      switch (error.code) {
        case 'auth/user-not-found':
          setErro('Usuário não encontrado. Verifique seu e-mail.')
          break
        case 'auth/wrong-password':
          setErro('Senha incorreta. Tente novamente.')
          break
        case 'auth/invalid-email':
          setErro('E-mail inválido. Digite um e-mail válido.')
          break
        case 'auth/too-many-requests':
          setErro('Muitas tentativas. Aguarde alguns minutos.')
          break
        default:
          setErro('Erro ao fazer login. Tente novamente.')
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.icon}>🔐</span>
          <h1 style={styles.title}>Área Restrita</h1>
          <p style={styles.subtitle}>Acesso exclusivo para administradores</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>E-mail</label>
            <input
              type="email"
              placeholder="admin@mollomultimarcas.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {erro && <div style={styles.error}>{erro}</div>}

          <button type="submit" style={styles.btn} disabled={carregando}>
            {carregando ? '⏳ Entrando...' : '🔓 Entrar'}
          </button>

          <div style={styles.demo}>
            <p>💡 <strong>Dica:</strong> Crie um usuário no Firebase Console</p>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '70vh'
  },
  card: {
    background: 'var(--white)',
    padding: '40px',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow-lg)',
    maxWidth: '420px',
    width: '100%'
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  icon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '10px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 800,
    color: 'var(--primary)',
    marginBottom: '6px'
  },
  subtitle: {
    color: 'var(--text-light)',
    fontSize: '15px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
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
    padding: '14px 16px',
    border: '2px solid var(--gray-200)',
    borderRadius: '8px',
    fontSize: '16px',
    background: 'var(--light)',
    transition: 'var(--transition)'
  },
  error: {
    background: '#fde8e8',
    color: 'var(--danger)',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    textAlign: 'center'
  },
  btn: {
    background: 'var(--primary)',
    color: 'var(--white)',
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 700,
    transition: 'var(--transition)',
    marginTop: '10px'
  },
  demo: {
    textAlign: 'center',
    fontSize: '13px',
    color: 'var(--text-light)',
    padding: '10px',
    background: 'var(--gray-100)',
    borderRadius: '8px'
  }
}

export default AcessoRestrito