export interface Product {
  id: string
  name: string
  price: number
  stock: number
  image?: string
  /** 会計時に出す注意書き。無配ペーパーなどの渡し忘れ防止に使う */
  note?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface SaleRecord {
  id: string
  date: string
  items: { name: string; price: number; quantity: number }[]
  total: number
  memo?: string
}
