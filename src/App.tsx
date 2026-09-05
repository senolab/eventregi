import { useState, useEffect } from 'react'
import SalesPage from './pages/SalesPage'
import ProductsPage from './pages/ProductsPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import { THEMES, DEFAULT_THEME_ID, applyTheme } from './themes'
import { loadThemeId } from './store'
import { CartIcon, BookIcon, ChartIcon, SlidersIcon } from './icons'
import './App.css'

type Tab = 'sales' | 'products' | 'history' | 'settings'

export default function App() {
  const [tab, setTab] = useState<Tab>('sales')

  useEffect(() => {
    const id = loadThemeId() ?? DEFAULT_THEME_ID
    const theme = THEMES.find(t => t.id === id) ?? THEMES[0]
    applyTheme(theme)
  }, [])

  return (
    <div className="app">
      <main className="main">
        {tab === 'sales' && <SalesPage />}
        {tab === 'products' && <ProductsPage />}
        {tab === 'history' && <HistoryPage />}
        {tab === 'settings' && <SettingsPage />}
      </main>
      <nav className="bottom-nav">
        <button className={tab === 'sales' ? 'active' : ''} onClick={() => setTab('sales')}>
          <CartIcon className="nav-icon" />
          <span>レジ</span>
        </button>
        <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>
          <BookIcon className="nav-icon" />
          <span>商品</span>
        </button>
        <button className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}>
          <ChartIcon className="nav-icon" />
          <span>売上</span>
        </button>
        <button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}>
          <SlidersIcon className="nav-icon" />
          <span>設定</span>
        </button>
      </nav>
    </div>
  )
}
