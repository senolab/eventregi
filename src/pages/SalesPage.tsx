import { useState, useEffect } from 'react'
import type { Product, CartItem, SaleRecord } from '../types'
import { loadProducts, saveProducts, loadSales, saveSales, loadGridColumns } from '../store'
import './SalesPage.css'


export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [received, setReceived] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [gridColumns, setGridColumns] = useState(2)
  const [step, setStep] = useState(0) // 0: 商品選択, 1: 合計確認, 2: お釣り計算

  useEffect(() => {
    setProducts(loadProducts())
    setGridColumns(loadGridColumns())
  }, [])

  // カートに商品があればステップ1に進める
  useEffect(() => {
    if (cart.length > 0 && step === 0) {
      setStep(1)
    }
  }, [cart, step])

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) return prev
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const receivedNum = parseInt(received) || 0
  const change = receivedNum >= total ? receivedNum - total : null

  const addReceived = (amount: number) => {
    setReceived(prev => String((parseInt(prev) || 0) + amount))
  }

  const cartQuantity = (productId: string) =>
    cart.find(item => item.product.id === productId)?.quantity ?? 0

  const handleConfirm = () => {
    if (cart.length === 0) return

    const updatedProducts = products.map(p => {
      const cartItem = cart.find(item => item.product.id === p.id)
      if (cartItem) return { ...p, stock: p.stock - cartItem.quantity }
      return p
    })
    saveProducts(updatedProducts)
    setProducts(updatedProducts)

    const record: SaleRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('ja-JP'),
      items: cart.map(item => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
      total,
      memo: undefined,
    }
    saveSales([record, ...loadSales()])

    setCart([])
    setReceived('')
    setStep(0)
    setConfirmed(true)
    setTimeout(() => setConfirmed(false), 2000)
  }

  const handleGoToPayment = () => {
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleClear = () => {
    setCart([])
    setReceived('')
    setStep(0)
  }

  return (
    <div className="sales-page">
      <div className="page-header">
        レジ
        {cart.length > 0 && (
          <button className="header-clear-btn" onClick={handleClear}>
            クリア
          </button>
        )}
      </div>

      {(step === 0 || step === 1) && (
        <>
          {products.length === 0 ? (
            <div className="empty-state">
              <p>商品が登録されていません</p>
              <p className="empty-hint">「商品」タブから登録してください</p>
            </div>
          ) : (
            <div
              className="product-grid-wrap"
              style={{ paddingBottom: cart.length > 0 ? '360px' : '16px' }}
            >
              <div
                className="product-grid"
                style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
              >
              {products.map(product => {
                const qty = cartQuantity(product.id)
                const soldOut = product.stock <= 0
                return (
                  <button
                    key={product.id}
                    className={`product-card ${soldOut ? 'sold-out' : ''} ${qty > 0 ? 'in-cart' : ''}`}
                    onClick={() => addToCart(product)}
                    disabled={soldOut}
                  >
                    {qty > 0 && <span className="cart-badge">{qty}</span>}
                    <div className="product-card-image-wrap">
                      {product.image
                        ? <img src={product.image} className="product-card-img" alt={product.name} />
                        : <span className="product-card-icon">📚</span>
                      }
                    </div>
                    <span className="product-name">{product.name}</span>
                    <span className="product-price">¥{product.price.toLocaleString()}</span>
                    <span className="product-stock">
                      {soldOut ? '在庫なし' : `残${product.stock}`}
                    </span>
                  </button>
                )
              })}
              </div>
            </div>
          )}
        </>
      )}

      {cart.length > 0 && (step === 1 || step === 2) && (
        <div className={`checkout-panel${step === 2 ? ' checkout-panel--fullpage' : ''}`}>
          {/* お客様向け会計表示 */}
          <div className="receipt-section">
            <div className="receipt-header">お会計</div>
            <div className="receipt-items">
              {cart.map(item => (
                <div key={item.product.id} className="receipt-item">
                  <div className="receipt-item-left">
                    <span className="receipt-item-name">{item.product.name}</span>
                    <span className="receipt-item-unit">¥{item.product.price.toLocaleString()} × {item.quantity}</span>
                  </div>
                  <span className="receipt-item-total">
                    ¥{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="receipt-total-row">
              <span>合計</span>
              <span className="receipt-total-amount">¥{total.toLocaleString()}</span>
            </div>

            {step === 1 && (
              <div className="cart-actions step1-actions">
                <button className="btn-primary" onClick={handleGoToPayment}>
                  お会計へ
                </button>
              </div>
            )}

            {step === 2 && (
              <>
                <div className="receipt-received-row">
                  <span className="receipt-received-label">お預かり</span>
                  <div className="received-input-wrap">
                    <span className="yen-symbol">¥</span>
                    <input
                      className="received-input"
                      type="number"
                      inputMode="numeric"
                      placeholder="0"
                      value={received}
                      onChange={e => setReceived(e.target.value)}
                    />
                  </div>
                </div>

                {/* 操作エリア */}
                <div className="operator-section">
                  <div className="quick-btns">
                    {[100, 500].map(v => (
                      <button key={v} className="quick-btn quick-btn--square" onClick={() => addReceived(v)}>
                        <span className="quick-btn-icon">🪙</span>
                        <span>{v.toLocaleString()}</span>
                      </button>
                    ))}
                    <button className="quick-btn quick-btn--square" onClick={() => addReceived(1000)}>
                      <span className="quick-btn-icon">💴</span>
                      <span>1,000</span>
                    </button>
                  </div>
                  <div className="quick-btns">
                    {[5000, 10000].map(v => (
                      <button key={v} className="quick-btn quick-btn--square" onClick={() => addReceived(v)}>
                        <span className="quick-btn-icon">💴</span>
                        <span>{v.toLocaleString()}</span>
                      </button>
                    ))}
                    <button className="quick-btn quick-btn--clear" onClick={() => setReceived('')}>
                      <span>C</span>
                    </button>
                  </div>
                </div>

                <div className={`receipt-change ${receivedNum === 0 ? 'placeholder' : change === null ? 'insufficient' : ''}`}>
                  <span>{receivedNum === 0 ? 'お釣り' : change === null ? '不足' : 'お釣り'}</span>
                  <span>{receivedNum === 0
                    ? '—'
                    : change === null
                      ? `¥${(total - receivedNum).toLocaleString()}`
                      : `¥${change.toLocaleString()}`}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step2-footer">
          <button className="btn-secondary" onClick={handleBack}>
            戻る
          </button>
          <button className="btn-primary confirm-btn" onClick={handleConfirm}>
            {confirmed ? '✓ 完了！' : '会計確定'}
          </button>
        </div>
      )}
    </div>
  )
}
