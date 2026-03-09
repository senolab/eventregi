export interface Theme {
  id: string
  name: string
  primary: string
  light: string
  border: string
}

export const THEMES: Theme[] = [
  { id: 'mint',      name: 'ミント',       primary: '#2BAE85', light: '#F0FAF7', border: '#A0DDD0' },
  { id: 'mustard',   name: 'マスタード',   primary: '#F5C827', light: '#FFFBE0', border: '#F5DC70' },
  { id: 'pink',      name: 'ピンク',       primary: '#FF6B9D', light: '#FFF0F5', border: '#FFB3D0' },
  { id: 'lavender',  name: 'ラベンダー',   primary: '#8B6FD6', light: '#F5F0FF', border: '#C5B0F0' },
  { id: 'navy',      name: 'ネイビー',     primary: '#3A6EBF', light: '#EEF3FB', border: '#A5BFE0' },
]

export const DEFAULT_THEME_ID = 'mint'

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.style.setProperty('--color-primary', theme.primary)
  root.style.setProperty('--color-primary-light', theme.light)
  root.style.setProperty('--color-primary-border', theme.border)
}
