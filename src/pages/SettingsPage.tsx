import { useState, useEffect, useRef } from 'react'
import { THEMES, DEFAULT_THEME_ID, applyTheme } from '../themes'
import {
  loadThemeId, saveThemeId, loadGridColumns, saveGridColumns, loadInputMode, saveInputMode,
  buildBackup, parseBackup, restoreBackup,
} from '../store'
import type { InputMode } from '../store'
import { saveFile } from '../fileSave'
import { CalculatorIcon, CoinIcon, UploadIcon, DownloadIcon } from '../icons'
import './SettingsPage.css'

function backupFilename(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `イベントレジ_バックアップ_${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}.json`
}

export default function SettingsPage() {
  const [selectedId, setSelectedId] = useState(DEFAULT_THEME_ID)
  const [gridColumns, setGridColumns] = useState(3)
  const [inputMode, setInputMode] = useState<InputMode>('buttons')
  const [backupMessage, setBackupMessage] = useState<{ text: string; error: boolean } | null>(null)
  const restoreInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSelectedId(loadThemeId() ?? DEFAULT_THEME_ID)
    setGridColumns(loadGridColumns())
    setInputMode(loadInputMode())
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

  const handleInputMode = (mode: InputMode) => {
    saveInputMode(mode)
    setInputMode(mode)
  }

  const handleBackup = async () => {
    const backup = buildBackup()
    try {
      await saveFile(backupFilename(), 'application/json', JSON.stringify(backup, null, 2))
      setBackupMessage({
        text: `商品${backup.products.length}件・売上${backup.sales.length}件を書き出しました`,
        error: false,
      })
    } catch {
      setBackupMessage({ text: '書き出しに失敗しました', error: true })
    }
  }

  const handleRestoreFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // 同じファイルを連続で選べるように値をリセットしておく
    e.target.value = ''
    if (!file) return

    try {
      const backup = parseBackup(await file.text())
      const ok = confirm(
        `商品${backup.products.length}件・売上${backup.sales.length}件を復元します。\n`
        + '現在のデータはすべて置き換わります。よろしいですか？'
      )
      if (!ok) return
      restoreBackup(backup)
      // テーマや列数も含めて確実に反映させるため読み込み直す
      location.reload()
    } catch (err) {
      setBackupMessage({ text: (err as Error).message, error: true })
    }
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
        <div className="settings-label">お預かり金入力方式</div>
        <div className="input-mode-options">
          <button
            className={`input-mode-btn ${inputMode === 'calc' ? 'selected' : ''}`}
            onClick={() => handleInputMode('calc')}
          >
            <CalculatorIcon className="input-mode-icon" />
            <span className="input-mode-name">電卓入力</span>
            <span className="input-mode-desc">数字キーで直接入力</span>
          </button>
          <button
            className={`input-mode-btn ${inputMode === 'buttons' ? 'selected' : ''}`}
            onClick={() => handleInputMode('buttons')}
          >
            <CoinIcon className="input-mode-icon" />
            <span className="input-mode-name">ボタン入力</span>
            <span className="input-mode-desc">硬貨・紙幣ボタンで加算</span>
          </button>
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

      <div className="settings-section">
        <div className="settings-label">データのバックアップ</div>
        <p className="settings-note">
          ホーム画面のアプリとSafariでは保存場所が分かれています。機種変更や入れ直しに備えて、
          イベント前後に書き出しておくと安心です。
        </p>
        <div className="backup-actions">
          <button className="btn-secondary backup-btn" onClick={handleBackup}>
            <UploadIcon className="btn-icon" />バックアップを書き出す
          </button>
          <button className="btn-secondary backup-btn" onClick={() => restoreInputRef.current?.click()}>
            <DownloadIcon className="btn-icon" />バックアップから復元
          </button>
        </div>
        <input
          ref={restoreInputRef}
          type="file"
          accept="application/json,.json"
          style={{ display: 'none' }}
          onChange={handleRestoreFile}
        />
        {backupMessage && (
          <p className={`backup-message ${backupMessage.error ? 'error' : ''}`}>
            {backupMessage.text}
          </p>
        )}
      </div>

      <div className="settings-version">
        バージョン {new Date(__BUILD_TIME__).toLocaleString('ja-JP')}
      </div>
    </div>
  )
}
