import { useState } from 'react'
import { supabase } from '../supabase'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true); setError(''); setMsg('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true); setError(''); setMsg('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else setMsg('Conta criada! Verifique seu e-mail para confirmar.')
    setLoading(false)
  }

  async function handleReset(e) {
    e.preventDefault()
    setLoading(true); setError(''); setMsg('')
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) setError(error.message)
    else setMsg('Link de redefinição enviado para o seu e-mail.')
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <div className="login-wordmark">VINTER</div>
          <div className="login-tagline">Gestão Financeira</div>
        </div>

        {mode === 'login' && (
          <>
            <div className="login-title">Bem-vindo de volta</div>
            <div className="login-sub">Entre com seus dados para acessar</div>
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input className="form-input" type="email" placeholder="seu@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Senha</label>
                <input className="form-input" type="password" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {error && <div className="login-error">{error}</div>}
              {msg && <div className="login-error" style={{color:'var(--green)',background:'var(--green-bg)'}}>{msg}</div>}
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
            <div className="login-link" style={{marginTop:12}}>
              <span onClick={() => { setMode('reset'); setError(''); setMsg('') }}>Esqueci minha senha</span>
            </div>
            <div className="login-link">
              Não tem conta? <span onClick={() => { setMode('signup'); setError(''); setMsg('') }}>Criar conta</span>
            </div>
          </>
        )}

        {mode === 'signup' && (
          <>
            <div className="login-title">Criar conta</div>
            <div className="login-sub">Preencha para criar seu acesso</div>
            <form className="login-form" onSubmit={handleSignup}>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input className="form-input" type="email" placeholder="seu@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Senha</label>
                <input className="form-input" type="password" placeholder="mínimo 6 caracteres"
                  value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {error && <div className="login-error">{error}</div>}
              {msg && <div className="login-error" style={{color:'var(--green)',background:'var(--green-bg)'}}>{msg}</div>}
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? 'Criando...' : 'Criar conta'}
              </button>
            </form>
            <div className="login-link">
              Já tem conta? <span onClick={() => { setMode('login'); setError(''); setMsg('') }}>Entrar</span>
            </div>
          </>
        )}

        {mode === 'reset' && (
          <>
            <div className="login-title">Redefinir senha</div>
            <div className="login-sub">Enviaremos um link para seu e-mail</div>
            <form className="login-form" onSubmit={handleReset}>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input className="form-input" type="email" placeholder="seu@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
              </div>
              {error && <div className="login-error">{error}</div>}
              {msg && <div className="login-error" style={{color:'var(--green)',background:'var(--green-bg)'}}>{msg}</div>}
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar link'}
              </button>
            </form>
            <div className="login-link">
              <span onClick={() => { setMode('login'); setError(''); setMsg('') }}>← Voltar ao login</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
