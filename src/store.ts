import type { Product, SaleRecord } from './types'

const PRODUCTS_KEY = 'eventreji_products'
const SALES_KEY = 'eventreji_sales'
const THEME_KEY = 'eventreji_theme'

export function generateId(): string {
  return crypto.randomUUID()
}

function parseJSON<T>(data: string | null, fallback: T): T {
  if (!data) return fallback
  try {
    return JSON.parse(data) as T
  } catch {
    return fallback
  }
}

export function loadProducts(): Product[] {
  return parseJSON(localStorage.getItem(PRODUCTS_KEY), [])
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export function loadSales(): SaleRecord[] {
  return parseJSON(localStorage.getItem(SALES_KEY), [])
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

const INPUT_MODE_KEY = 'eventreji_input_mode'
export type InputMode = 'buttons' | 'calc'

export function loadInputMode(): InputMode {
  return (localStorage.getItem(INPUT_MODE_KEY) as InputMode) ?? 'calc'
}

export function saveInputMode(mode: InputMode): void {
  localStorage.setItem(INPUT_MODE_KEY, mode)
}
