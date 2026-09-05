/**
 * Service Worker の登録と更新。
 *
 * iOS のホーム画面アプリはアイコンをタップしてもリロードされず、サスペンドから
 * 復帰するだけのことが多い。そのため通常の登録だけでは新しいバージョンを
 * デプロイしても画面が古いままになる。ここでは
 *   1. 前面に戻るたびに更新を確認する
 *   2. 新しい Service Worker が制御を引き継いだら画面を作り直す
 * の 2 つを行って、アプリを開き直すだけで更新が反映されるようにする。
 */
export function setupServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return

  // 初回登録時は clientsClaim でも controllerchange が発火するが、
  // その時点で既に最新なのでリロードは不要。区別するために覚えておく。
  const hadController = navigator.serviceWorker.controller !== null

  let reloading = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloading) return
    reloading = true
    window.location.reload()
  })

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
      .then(registration => {
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') registration.update()
        })
      })
      .catch(() => {
        // 登録に失敗してもレジ機能自体は動くので、ここでは何もしない
      })
  })
}
