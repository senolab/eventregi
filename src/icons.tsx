/**
 * ナビゲーション用のアイコン。
 *
 * 絵文字は端末ごとに見た目が変わるうえ、テーマカラーに追従できないため
 * インライン SVG で描いている。線の色は currentColor なので、選択中のタブでは
 * 親要素の color（テーマカラー）がそのまま反映される。
 */

type IconProps = { className?: string }

const stroke = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

/** レジ：買い物カゴ */
export function CartIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M2.5 3.6h1.9a1 1 0 0 1 .98.8L5.7 6" />
      <path d="M5.7 6h14.8l-1.7 8.1a1.6 1.6 0 0 1-1.57 1.27H8.97A1.6 1.6 0 0 1 7.4 14.1Z" />
      <circle cx="9.6" cy="19.4" r="1.5" />
      <circle cx="16.6" cy="19.4" r="1.5" />
    </svg>
  )
}

/** 商品：開いた本 */
export function BookIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M12 7.2v12.6" />
      <path d="M12 7.2C10.2 5.6 7.6 4.9 3.3 5.1v12.7c4.3-.2 6.9.5 8.7 2.1 1.8-1.6 4.4-2.3 8.7-2.1V5.1c-4.3-.2-6.9.5-8.7 2.1Z" />
    </svg>
  )
}

/** 売上：棒グラフ */
export function ChartIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <rect x="3.4" y="12.4" width="4.8" height="7.6" rx="1.4" />
      <rect x="9.6" y="6.6" width="4.8" height="13.4" rx="1.4" />
      <rect x="15.8" y="9.4" width="4.8" height="10.6" rx="1.4" />
    </svg>
  )
}

/** 設定：スライダー */
export function SlidersIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M3.5 8h9" />
      <circle cx="15" cy="8" r="2.5" />
      <path d="M17.5 8h3" />
      <path d="M3.5 16h3" />
      <circle cx="9" cy="16" r="2.5" />
      <path d="M11.5 16h9" />
    </svg>
  )
}
