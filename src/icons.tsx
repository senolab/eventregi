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

/** 売上：棒グラフ（底面に軸あり） */
export function ChartIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M2.6 20.4h18.8" />
      <path d="M3.9 20.4V13a1.4 1.4 0 0 1 1.4-1.4h1.5A1.4 1.4 0 0 1 8.2 13v7.4" />
      <path d="M9.9 20.4V7.2a1.4 1.4 0 0 1 1.4-1.4h1.5a1.4 1.4 0 0 1 1.4 1.4v13.2" />
      <path d="M15.9 20.4v-10a1.4 1.4 0 0 1 1.4-1.4h1.5a1.4 1.4 0 0 1 1.4 1.4v10" />
    </svg>
  )
}

/** 硬貨 */
export function CoinIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <circle cx="12" cy="12" r="8.6" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

/** 紙幣 */
export function BillIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <rect x="2.4" y="6" width="19.2" height="12" rx="2.2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 10v4" />
      <path d="M18 10v4" />
    </svg>
  )
}

/** おまけ：贈り物 */
export function GiftIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <rect x="3" y="9.6" width="18" height="4.2" rx="1.2" />
      <path d="M4.6 13.8v5.6a1.8 1.8 0 0 0 1.8 1.8h11.2a1.8 1.8 0 0 0 1.8-1.8v-5.6" />
      <path d="M12 9.6v11.6" />
      <path d="M12 9.6C11 6.4 9.6 5 8.2 5a2.3 2.3 0 0 0 0 4.6Z" />
      <path d="M12 9.6C13 6.4 14.4 5 15.8 5a2.3 2.3 0 0 1 0 4.6Z" />
    </svg>
  )
}

/** メモ：鉛筆 */
export function PencilIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M16.9 3.9a2.3 2.3 0 0 1 3.2 3.2L8.3 18.9l-4.2 1 1-4.2z" />
      <path d="M15.3 5.5l3.2 3.2" />
    </svg>
  )
}

/** 電卓 */
export function CalculatorIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <rect x="4.6" y="2.6" width="14.8" height="18.8" rx="2.4" />
      <rect x="7.8" y="5.8" width="8.4" height="3.4" rx="1" />
      {[12.9, 16.4].map(cy =>
        [8.6, 12, 15.4].map(cx => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.05" fill="currentColor" stroke="none" />
        ))
      )}
    </svg>
  )
}

/** 書き出し */
export function UploadIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M12 15.2V3.6" />
      <path d="M7.6 8 12 3.6 16.4 8" />
      <path d="M3.8 16v2.4a2.2 2.2 0 0 0 2.2 2.2h12a2.2 2.2 0 0 0 2.2-2.2V16" />
    </svg>
  )
}

/** 読み込み */
export function DownloadIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M12 3.6v11.6" />
      <path d="M7.6 10.8 12 15.2l4.4-4.4" />
      <path d="M3.8 16v2.4a2.2 2.2 0 0 0 2.2 2.2h12a2.2 2.2 0 0 0 2.2-2.2V16" />
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
