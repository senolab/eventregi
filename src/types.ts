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

export interface SaleItem {
  name: string
  price: number
  quantity: number
  /** 取り消したときに在庫を戻す先。名前は変わりうるので id で照合する。
   * この項目を追加する前の記録には入っていないため任意 */
  productId?: string
}

export interface SaleRecord {
  id: string
  date: string
  items: SaleItem[]
  total: number
  memo?: string
}
