import { useState, useEffect } from 'react'
import type { SaleRecord } from '../types'
import { loadSales, saveSales, loadProducts } from '../store'
import { saveFile } from '../fileSave'
import { PencilIcon, UploadIcon } from '../icons'
import './HistoryPage.css'

function escapeCsv(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

function fileStamp(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`
}

export default function HistoryPage() {
  const [sales, setSales] = useState<SaleRecord[]>([])
  const [productOrder, setProductOrder] = useState<string[]>([])
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null)
  const [memoInput, setMemoInput] = useState('')

  useEffect(() => {
    setSales(loadSales())
    setProductOrder(loadProducts().map(p => p.name))
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
    // 商品タブの並び順に揃える。削除済みなど一覧にない商品は末尾へ
    const rank = (name: string) => {
      const i = productOrder.indexOf(name)
      return i === -1 ? productOrder.length : i
    }
    return Array.from(map.entries())
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => rank(a.name) - rank(b.name))
  })()

  const handleClear = () => {
    if (!confirm('売上履歴をすべて削除しますか？')) return
    saveSales([])
    setSales([])
  }

  const handleExport = () => {
    const rows: string[][] = [
      ['売上明細'],
      ['日時', '商品名', '単価', '数量', '小計', 'メモ'],
    ]
    // 履歴は新しい順に保存されているので、古い順に出力する
    for (const sale of [...sales].reverse()) {
      for (const item of sale.items) {
        rows.push([
          sale.date,
          item.name,
          String(item.price),
          String(item.quantity),
          String(item.price * item.quantity),
          sale.memo ?? '',
        ])
      }
    }
    rows.push([])
    rows.push(['商品別集計'])
    rows.push(['商品名', '冊数', '売上金額'])
    for (const p of productSummary) {
      rows.push([p.name, String(p.quantity), String(p.revenue)])
    }
    rows.push([])
    rows.push(['総売上', String(totalRevenue)])
    rows.push(['会計回数', String(sales.length)])

    const csv = rows
      .map(row => row.map(escapeCsv).join(','))
      .join('\r\n')

    // Excel が UTF-8 と認識できるよう BOM を付ける
    saveFile(`売上_${fileStamp()}.csv`, 'text/csv;charset=utf-8', '﻿' + csv)
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
                      ? <span className="sale-memo"><PencilIcon className="memo-icon" />{sale.memo}</span>
                      : <span className="memo-placeholder">＋ メモを追加</span>
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="export-btn-wrap">
            <button className="btn-secondary export-btn" onClick={handleExport}>
              <UploadIcon className="btn-icon" />CSVでエクスポート
            </button>
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
