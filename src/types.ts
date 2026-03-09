export interface Product {
  id: string
  name: string
  price: number
  stock: number
  image?: string
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
