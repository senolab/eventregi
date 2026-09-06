import { useState, useEffect } from 'react'
import type { Product, CartItem, SaleRecord } from '../types'
import { loadProducts, saveProducts, loadSales, saveSales, loadGridColumns, loadInputMode, generateId } from '../store'
import type { InputMode } from '../store'
import { BookIcon, GiftIcon } from '../icons'
import coin100 from '../assets/money/coin_100.webp'
import coin500 from '../assets/money/coin_500.webp'
import bill1000 from '../assets/money/bill_1000.webp'
import bill5000 from '../assets/money/bill_5000.webp'
import bill10000 from '../assets/money/bill_10000.webp'
import './SalesPage.css'

const COIN_AMOUNTS = [100, 500]
const BILL_AMOUNTS = [1000, 5000, 10000]

/** 金種ごとのイラスト（いらすとや）。色はイラスト自体が持つので地色は付けない */
const MONEY_IMAGES: Record<number, string> = {
  100: coin100,
  500: coin500,
  1000: bill1000,
  5000: bill5000,
  10000: bill10000,
}

type CartNote = { name: string; note: string }

/** 会計時の注意書き。渡し忘れを防ぐため目立たせる */
function NoteBanner({ notes }: { notes: CartNote[] }) {
  if (notes.length === 0) return null
  return (
    <div className="note-banner">
      {notes.map(n => (
        <div key={n.name} className="note-banner-row">
          <GiftIcon className="note-banner-icon" />
          <span className="note-banner-text">
            <span className="note-banner-product">{n.name}</span>
            {n.note}
          </span>
        </div>
      ))}
    </div>
  )
}

/** お預かり金の加算ボタン */
function MoneyKey({ amount, onPress }: { amount: number; onPress: (v: number) => void }) {
  const isCoin = COIN_AMOUNTS.includes(amount)
  return (
    <button
      className={`quick-btn quick-btn--square quick-btn--money ${isCoin ? 'is-coin' : 'is-bill'}`}
      onClick={() => onPress(amount)}
    >
      <img src={MONEY_IMAGES[amount]} className="money-img" alt="" />
      <span className="quick-btn-amount">{amount.toLocaleString()}</span>
    </button>
  )
}

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [received, setReceived] = useState('')
  const [gridColumns, setGridColumns] = useState(2)
  const [step, setStep] = useState(0) // 0: 商品選択, 1: 合計確認, 2: お釣り計算, 3: 完了
  const [completedSummary, setCompletedSummary] = useState<
    { total: number; received: number; change: number; notes: CartNote[] } | null
  >(null)
  const [inputMode, setInputMode] = useState<InputMode>('calc')

  useEffect(() => {
    setProducts(loadProducts())
    setGridColumns(loadGridColumns())
    setInputMode(loadInputMode())
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

  // 会計時に伝えることがある商品（無配ペーパーなど）
  const cartNotes: CartNote[] = cart
    .filter(item => item.product.note)
    .map(item => ({ name: item.product.name, note: item.product.note! }))

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const receivedNum = parseInt(received) || 0
  const change = receivedNum >= total ? receivedNum - total : null

  const addReceived = (amount: number) => {
    setReceived(prev => String((parseInt(prev) || 0) + amount))
  }

  const handleCalcInput = (key: string) => {
    if (key === 'C') {
      setReceived('')
    } else if (key === '00') {
      setReceived(prev => prev === '' ? '' : prev + '00')
    } else {
      setReceived(prev => {
        const next = prev + key
        return String(parseInt(next))
      })
    }
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
      id: generateId(),
      date: new Date().toLocaleString('ja-JP'),
      items: cart.map(item => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
      total,
    }
    saveSales([record, ...loadSales()])

    setCompletedSummary({ total, received: receivedNum, change: change ?? 0, notes: cartNotes })
    setCart([])
    setReceived('')
    setStep(3)
  }

  const handleNextCustomer = () => {
    setCompletedSummary(null)
    setStep(0)
  }

  const handleGoToPayment = () => {
    setInputMode(loadInputMode())
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

  const calcKeys = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['00', '0', 'C'],
  ]

  return (
    <div className="sales-page">
      <div className="page-header">
        レジ
        {cart.length > 0 && step !== 2 && (
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
                        : <BookIcon className="product-card-icon" />
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

            <NoteBanner notes={cartNotes} />

            {step === 1 && (
              <div className="cart-actions step1-actions">
                <button className="btn-primary" onClick={handleGoToPayment}>
                  お会計へ
                </button>
              </div>
            )}

            {step === 2 && (
              <>
                {/* お預かり表示 */}
                <div className="receipt-received-row">
                  <span className="receipt-received-label">お預かり</span>
                  <div className="received-display">
                    <span className="received-display-yen">¥</span>
                    <span className="received-display-amount">
                      {receivedNum > 0 ? receivedNum.toLocaleString() : '—'}
                    </span>
                  </div>
                </div>

                {/* お釣り */}
                <div className={`receipt-change ${receivedNum === 0 ? 'placeholder' : change === null ? 'insufficient' : ''}`}>
                  <span>{receivedNum === 0 ? 'お釣り' : change === null ? '不足' : 'お釣り'}</span>
                  <span>{receivedNum === 0
                    ? '—'
                    : change === null
                      ? `¥${(total - receivedNum).toLocaleString()}`
                      : `¥${change.toLocaleString()}`}
                  </span>
                </div>

                {/* 操作エリア */}
                {inputMode === 'buttons' ? (
                  <div className="operator-section">
                    <div className="quick-btns">
                      {COIN_AMOUNTS.map(v => (
                        <MoneyKey key={v} amount={v} onPress={addReceived} />
                      ))}
                      {BILL_AMOUNTS.slice(0, 1).map(v => (
                        <MoneyKey key={v} amount={v} onPress={addReceived} />
                      ))}
                    </div>
                    <div className="quick-btns">
                      {BILL_AMOUNTS.slice(1).map(v => (
                        <MoneyKey key={v} amount={v} onPress={addReceived} />
                      ))}
                      <button className="quick-btn quick-btn--clear" onClick={() => setReceived('')}>
                        <span>C</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="calc-pad">
                    {calcKeys.map((row, ri) => (
                      <div key={ri} className="calc-row">
                        {row.map(key => (
                          <button
                            key={key}
                            className={`calc-key ${key === 'C' ? 'calc-key--clear' : ''}`}
                            onClick={() => handleCalcInput(key)}
                          >
                            {key}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
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
          <button
            className="btn-primary confirm-btn"
            onClick={handleConfirm}
            disabled={receivedNum < total}
          >
            会計確定
          </button>
        </div>
      )}

      {step === 3 && completedSummary && (
        <div className="complete-screen">
          <div className="complete-check">✓</div>
          <div className="complete-title">会計完了</div>
          <div className="complete-summary">
            <div className="complete-row">
              <span>合計</span>
              <span>¥{completedSummary.total.toLocaleString()}</span>
            </div>
            <div className="complete-row">
              <span>お預かり</span>
              <span>¥{completedSummary.received.toLocaleString()}</span>
            </div>
            <div className="complete-row complete-row--change">
              <span>お釣り</span>
              <span>¥{completedSummary.change.toLocaleString()}</span>
            </div>
          </div>
          <NoteBanner notes={completedSummary.notes} />
          <button className="btn-primary complete-next-btn" onClick={handleNextCustomer}>
            次の会計へ
          </button>
        </div>
      )}
    </div>
  )
}
