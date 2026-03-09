import type { Product, SaleRecord } from './types'

const PRODUCTS_KEY = 'eventreji_products'
const SALES_KEY = 'eventreji_sales'
const THEME_KEY = 'eventreji_theme'

export function loadProducts(): Product[] {
  const data = localStorage.getItem(PRODUCTS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export function loadSales(): SaleRecord[] {
  const data = localStorage.getItem(SALES_KEY)
  return data ? JSON.parse(data) : []
}

export function saveSales(sales: SaleRecord[]): void {
  localStorage.setItem(SALES_KEY, JSON.stringify(sales))
}

export function loadThemeId(): string | null {
  return localStorage.getItem(THEME_KEY)
}

export function saveThemeId(id: string): void {
  localStorage.setItem(THEME_KEY, id)
}

const GRID_KEY = 'eventreji_grid'

export function loadGridColumns(): number {
  return parseInt(localStorage.getItem(GRID_KEY) ?? '3')
}

export function saveGridColumns(n: number): void {
  localStorage.setItem(GRID_KEY, String(n))
}
