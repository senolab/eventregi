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

/* ---------------- バックアップ ----------------
 * iOS ではホーム画面アプリと Safari で保存領域が分かれており、機種変更や
 * 再インストールでもデータは引き継がれない。書き出し／復元で移せるようにする。
 */

const BACKUP_APP = 'eventregi'
const BACKUP_VERSION = 1

export interface BackupData {
  app: string
  version: number
  exportedAt: string
  products: Product[]
  sales: SaleRecord[]
  settings: {
    themeId: string | null
    gridColumns: number
    inputMode: InputMode
  }
}

export function buildBackup(): BackupData {
  return {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    products: loadProducts(),
    sales: loadSales(),
    settings: {
      themeId: loadThemeId(),
      gridColumns: loadGridColumns(),
      inputMode: loadInputMode(),
    },
  }
}

function isProduct(v: unknown): v is Product {
  const p = v as Product
  return !!p && typeof p === 'object'
    && typeof p.id === 'string' && typeof p.name === 'string'
    && typeof p.price === 'number' && typeof p.stock === 'number'
}

function isSale(v: unknown): v is SaleRecord {
  const s = v as SaleRecord
  return !!s && typeof s === 'object'
    && typeof s.id === 'string' && typeof s.date === 'string'
    && typeof s.total === 'number' && Array.isArray(s.items)
    && s.items.every(i =>
      !!i && typeof i.name === 'string'
      && typeof i.price === 'number' && typeof i.quantity === 'number')
}

/** バックアップを読み込んで内容を検証する。書き込みはまだ行わない */
export function parseBackup(text: string): BackupData {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('ファイルを読み取れませんでした')
  }
  const d = data as Partial<BackupData>
  if (!d || typeof d !== 'object' || !Array.isArray(d.products) || !Array.isArray(d.sales)) {
    throw new Error('このアプリのバックアップファイルではないようです')
  }
  if (!d.products.every(isProduct) || !d.sales.every(isSale)) {
    throw new Error('データが壊れているため復元できません')
  }
  return d as BackupData
}

/** 検証済みのバックアップで現在のデータを置き換える */
export function restoreBackup(backup: BackupData): void {
  saveProducts(backup.products)
  saveSales(backup.sales)
  const s = backup.settings
  if (s) {
    if (typeof s.themeId === 'string') saveThemeId(s.themeId)
    if (typeof s.gridColumns === 'number') saveGridColumns(s.gridColumns)
    if (s.inputMode === 'buttons' || s.inputMode === 'calc') saveInputMode(s.inputMode)
  }
}
