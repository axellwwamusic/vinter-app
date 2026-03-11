import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../supabase'
import { loadUserData, saveUserData } from '../utils/db'
import { initAllData } from '../utils/calc'
import Shows from './Shows'
import Monthly from './Monthly'
import Annual from './Annual'

const NAV = [
  { id: 'shows',   label: 'Lançar Shows',    icon: '🎵', group: 'Operacional' },
  { id: 'monthly', label: 'Fechamento Mensal', icon: '📊', group: 'Operacional' },
  { id: 'annual',  label: 'Fechamento Anual',  icon: '📈', group: 'Relatórios' },
]

export default function Dashboard({ session }) {
  const [page, setPage] = useState('shows')
  const [data, setData] = useState(null)
  const [saving, setSaving] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const saveTimer = useRef(null)

  const user = session.user

  // Load data on mount
  useEffect(() => {
    loadUserData(user.id).then(d => setData(d || initAllData()))
  }, [user.id])

  // Auto-save with debounce
  const triggerSave = useCallback((newData) => {
    setSaving(true)
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      await saveUserData(user.id, newData)
      setSaving(false)
    }, 1200)
  }, [user.id])

  function updateData(newData) {
    setData(newData)
    triggerSave(newData)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  const groups = [...new Set(NAV.map(n => n.group))]
  const currentNav = NAV.find(n => n.id === page)

  if (!data) return (
    <div className="splash">
      <div className="splash-logo">
        <span className="splash-name">VINTER</span>
        <span className="splash-sub">Carregando...</span>
      </div>
    </div>
  )

  return (
    <div className="app-layout">
      {/* Sidebar overlay for mobile */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-wordmark">VINTER</div>
          <div className="logo-year">Gestão Financeira · 2026</div>
        </div>

        <nav className="sidebar-nav">
          {groups.map(group => (
            <div className="nav-group" key={group}>
              <div className="nav-group-label">{group}</div>
              {NAV.filter(n => n.group === group).map(n => (
                <div
                  key={n.id}
                  className={`nav-item ${page === n.id ? 'active' : ''}`}
                  onClick={() => { setPage(n.id); setSidebarOpen(false) }}
                >
                  <span className="nav-icon">{n.icon}</span>
                  {n.label}
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-email">{user.email}</div>
            <div className="user-role">DJ Vinter</div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>Sair</button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="hamburger btn-ghost btn-icon" onClick={() => setSidebarOpen(o => !o)}>
              ☰
            </button>
            <div>
              <div className="page-title">{currentNav?.label}</div>
            </div>
          </div>
          <div className="topbar-right">
            <div className={`save-badge ${saving ? 'saving' : ''}`}>
              {saving ? 'Salvando...' : '✓ Salvo'}
            </div>
          </div>
        </header>

        <div className="page">
          {page === 'shows'   && <Shows   data={data} onChange={updateData} />}
          {page === 'monthly' && <Monthly data={data} onChange={updateData} />}
          {page === 'annual'  && <Annual  data={data} />}
        </div>
      </div>
    </div>
  )
}
