export interface Theme {
  id: string
  name: string
  primary: string
  light: string
  border: string
}

export const THEMES: Theme[] = [
  { id: 'mint',      name: 'グリーン',     primary: '#46A38D', light: '#EDF8F5', border: '#90D0BE' },
  { id: 'navy',      name: 'ネイビー',     primary: '#3A6EBF', light: '#EEF3FB', border: '#A5BFE0' },
  { id: 'pink',      name: 'ピンク',       primary: '#FF6B9D', light: '#FFF0F5', border: '#FFB3D0' },
  { id: 'lavender',  name: 'ラベンダー',   primary: '#8B6FD6', light: '#F5F0FF', border: '#C5B0F0' },
  { id: 'mustard',   name: 'アンバー',     primary: '#F09200', light: '#FFF5E0', border: '#F5C870' },
  { id: 'coral',     name: 'チェリー',     primary: '#D63B55', light: '#FFF0F3', border: '#F0A0B0' },
  { id: 'teal',      name: 'テール',       primary: '#1AADAD', light: '#EBF9F9', border: '#90D8D8' },
  { id: 'gray',      name: 'グレー',       primary: '#6B7280', light: '#F3F4F6', border: '#C0C4CC' },
]

export const DEFAULT_THEME_ID = 'mint'

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.style.setProperty('--color-primary', theme.primary)
  root.style.setProperty('--color-primary-light', theme.light)
  root.style.setProperty('--color-primary-border', theme.border)
}
