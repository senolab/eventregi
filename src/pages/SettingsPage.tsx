import { useState, useEffect } from 'react'
import { THEMES, DEFAULT_THEME_ID, applyTheme } from '../themes'
import { loadThemeId, saveThemeId, loadGridColumns, saveGridColumns } from '../store'
import './SettingsPage.css'

export default function SettingsPage() {
  const [selectedId, setSelectedId] = useState(DEFAULT_THEME_ID)
  const [gridColumns, setGridColumns] = useState(3)

  useEffect(() => {
    setSelectedId(loadThemeId() ?? DEFAULT_THEME_ID)
    setGridColumns(loadGridColumns())
  }, [])

  const handleSelectTheme = (id: string) => {
    const theme = THEMES.find(t => t.id === id)!
    applyTheme(theme)
    saveThemeId(id)
    setSelectedId(id)
  }

  const handleGridColumns = (n: number) => {
    saveGridColumns(n)
    setGridColumns(n)
  }

  return (
    <div>
      <div className="page-header">設定</div>

      <div className="settings-section">
        <div className="settings-label">商品の表示列数</div>
        <div className="grid-options">
          {[3, 4].map(n => (
            <button
              key={n}
              className={`grid-btn ${gridColumns === n ? 'selected' : ''}`}
              onClick={() => handleGridColumns(n)}
            >
              <div className={`grid-preview cols-${n}`}>
                {Array.from({ length: n * 2 }).map((_, i) => (
                  <div key={i} className="grid-preview-cell" />
                ))}
              </div>
              <span>{n}列</span>
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-label">テーマカラー</div>
        <div className="theme-grid">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              className={`theme-btn ${selectedId === theme.id ? 'selected' : ''}`}
              style={{ '--theme': theme.primary } as React.CSSProperties}
              onClick={() => handleSelectTheme(theme.id)}
            >
              <span className="theme-swatch" style={{ background: theme.primary }} />
              <span className="theme-name">{theme.name}</span>
              {selectedId === theme.id && <span className="theme-check">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
