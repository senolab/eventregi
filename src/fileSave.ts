/**
 * 文字列をファイルとして保存する。
 *
 * iOS のホーム画面アプリ（standalone 表示）では <a download> が無視され、
 * タップしても何も起きないことがある。その場合は共有シートを経由して
 * 「ファイルに保存」できるようにする。
 */
export async function saveFile(filename: string, mime: string, content: string): Promise<void> {
  const blob = new Blob([content], { type: mime })

  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true

  if (standalone && typeof navigator.share === 'function') {
    const file = new File([blob], filename, { type: mime })
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] })
        return
      } catch (e) {
        // 共有シートを閉じただけならそのまま終了する
        if ((e as DOMException).name === 'AbortError') return
        // それ以外の失敗は下のダウンロードで救済する
      }
    }
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
