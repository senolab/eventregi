import { useState, useEffect } from 'react'
import type { SaleRecord } from '../types'
import { loadSales, saveSales } from '../store'
import './HistoryPage.css'

export default function HistoryPage() {
  const [sales, setSales] = useState<SaleRecord[]>([])
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null)
  const [memoInput, setMemoInput] = useState('')

  useEffect(() => {
    setSales(loadSales())
  }, [])

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0)

  const productSummary = (() => {
    const map = new Map<string, { quantity: number; revenue: number }>()
    for (const sale of sales) {
      for (const item of sale.items) {
        const cur = map.get(item.name) ?? { quantity: 0, revenue: 0 }
        map.set(item.name, {
          quantity: cur.quantity + item.quantity,
          revenue: cur.revenue + item.price * item.quantity,
        })
      }
    }
    return Array.from(map.entries()).map(([name, v]) => ({ name, ...v }))
  })()

  const handleClear = () => {
    if (!confirm('売上履歴をすべて削除しますか？')) return
    saveSales([])
    setSales([])
  }

  const openMemoEdit = (sale: SaleRecord) => {
    setEditingMemoId(sale.id)
    setMemoInput(sale.memo ?? '')
  }

  const saveMemo = (id: string) => {
    const updated = sales.map(s =>
      s.id === id ? { ...s, memo: memoInput.trim() || undefined } : s
    )
    saveSales(updated)
    setSales(updated)
    setEditingMemoId(null)
  }

  return (
    <div>
      <div className="page-header">売上履歴</div>

      {sales.length > 0 && (
        <>
          <div className="summary-card">
            <div className="summary-item">
              <span className="summary-label">総売上</span>
              <span className="summary-value">¥{totalRevenue.toLocaleString()}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-item">
              <span className="summary-label">会計回数</span>
              <span className="summary-value">{sales.length}回</span>
            </div>
          </div>
          <div className="product-summary-card">
            <div className="product-summary-title">商品別売上</div>
            {productSummary.map(p => (
              <div key={p.name} className="product-summary-row">
                <span className="product-summary-name">{p.name}</span>
                <span className="product-summary-qty">{p.quantity}冊</span>
                <span className="product-summary-revenue">¥{p.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {sales.length === 0 ? (
        <div className="empty-state">
          <p>売上履歴はまだありません</p>
        </div>
      ) : (
        <>
          <div className="sale-list">
            {sales.map(sale => (
              <div key={sale.id} className="sale-record">
                <div className="sale-header">
                  <span className="sale-date">{sale.date}</span>
                  <span className="sale-total">¥{sale.total.toLocaleString()}</span>
                </div>
                <div className="sale-items">
                  {sale.items.map((item, i) => (
                    <div key={i} className="sale-item">
                      <span>{item.name} × {item.quantity}</span>
                      <span>¥{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                {editingMemoId === sale.id ? (
                  <div className="memo-edit-row">
                    <input
                      className="memo-edit-input"
                      type="text"
                      value={memoInput}
                      onChange={e => setMemoInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveMemo(sale.id)}
                      autoFocus
                      placeholder="メモを入力"
                    />
                    <button className="memo-save-btn" onClick={() => saveMemo(sale.id)}>保存</button>
                    <button className="memo-cancel-btn" onClick={() => setEditingMemoId(null)}>✕</button>
                  </div>
                ) : (
                  <div className="memo-row" onClick={() => openMemoEdit(sale)}>
                    {sale.memo
                      ? <span className="sale-memo">📝 {sale.memo}</span>
                      : <span className="memo-placeholder">＋ メモを追加</span>
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="clear-btn-wrap">
            <button className="btn-danger clear-btn" onClick={handleClear}>
              履歴を全削除
            </button>
          </div>
        </>
      )}
    </div>
  )
}
