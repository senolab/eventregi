import { useState, useEffect, useRef } from 'react'
import type { Product } from '../types'
import { loadProducts, saveProducts } from '../store'
import './ProductsPage.css'

type FormState = {
  name: string
  price: string
  stock: string
  image?: string
}

const emptyForm: FormState = { name: '', price: '', stock: '', image: undefined }

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 400
      let w = img.width
      let h = img.height
      if (w > h && w > MAX) { h = Math.round((h * MAX) / w); w = MAX }
      else if (h > MAX) { w = Math.round((w * MAX) / h); h = MAX }
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.src = url
  })
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setProducts(loadProducts())
  }, [])

  const persist = (updated: Product[]) => {
    setProducts(updated)
    saveProducts(updated)
  }

  const openAdd = () => {
    setForm(emptyForm)
    setEditId(null)
    setShowForm(true)
  }

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image,
    })
    setEditId(product.id)
    setShowForm(true)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const resized = await resizeImage(file)
    setForm(prev => ({ ...prev, image: resized }))
  }

  const handleSave = () => {
    const name = form.name.trim()
    const price = parseInt(form.price)
    const stock = parseInt(form.stock)
    if (!name || isNaN(price) || isNaN(stock)) return

    if (editId) {
      persist(products.map(p =>
        p.id === editId ? { ...p, name, price, stock, image: form.image } : p
      ))
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name,
        price,
        stock,
        image: form.image,
      }
      persist([...products, newProduct])
    }
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    if (!confirm('この商品を削除しますか？')) return
    persist(products.filter(p => p.id !== id))
  }

  return (
    <div>
      <div className="page-header">商品管理</div>

      {products.length === 0 && !showForm && (
        <div className="empty-state">
          <p>商品がまだありません</p>
        </div>
      )}

      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-row">
            {product.image
              ? <img src={product.image} className="product-thumb" alt={product.name} />
              : <div className="product-thumb-placeholder">📚</div>
            }
            <div className="product-info">
              <span className="product-row-name">{product.name}</span>
              <span className="product-row-meta">
                ¥{product.price.toLocaleString()} ／ 在庫 {product.stock}
              </span>
            </div>
            <div className="product-row-actions">
              <button className="btn-secondary" onClick={() => openEdit(product)}>編集</button>
              <button className="btn-danger" onClick={() => handleDelete(product.id)}>削除</button>
            </div>
          </div>
        ))}
      </div>

      {!showForm && (
        <div className="add-btn-wrap">
          <button className="btn-primary" onClick={openAdd}>＋ 商品を追加</button>
        </div>
      )}

      {showForm && (
        <div className="product-form">
          <h3>{editId ? '商品を編集' : '商品を追加'}</h3>

          <label>画像（任意）</label>
          <div className="image-picker" onClick={() => fileInputRef.current?.click()}>
            {form.image
              ? <img src={form.image} className="image-preview" alt="preview" />
              : <span className="image-picker-placeholder">タップして画像を選択</span>
            }
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />

          <label>タイトル</label>
          <input
            type="text"
            placeholder="例：夏コミ新刊"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <label>価格（円）</label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="例：500"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />
          <label>在庫数</label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="例：30"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
          />
          <div className="form-actions">
            <button className="btn-secondary" onClick={() => setShowForm(false)}>キャンセル</button>
            <button className="btn-primary save-btn" onClick={handleSave}>保存</button>
          </div>
        </div>
      )}
    </div>
  )
}
