# HyperFrames / Website Static Sand Noise Background

砂嵐・TV static風の背景アニメーションです。サイトの本文より背面に固定し、文字の可読性を優先した弱めの設定です。

## いちばん簡単な使い方

1. `noise-background.css` と `noise-background.js` をサイトへ配置
2. `<body>` 直下に以下を追加

```html
<div class="hf-noise-back" aria-hidden="true">
  <canvas class="hf-noise-back__canvas"></canvas>
</div>
```

3. CSSを読み込み

```html
<link rel="stylesheet" href="/assets/noise-background.css">
```

4. `</body>` の直前でJSを読み込み

```html
<script src="/assets/noise-background.js"></script>
```

## 強さ調整

CSSの先頭にある変数を変更します。

```css
:root {
  --noise-opacity: 0.34; /* 0.15〜0.45くらいがおすすめ */
  --noise-contrast: 1.08;
  --noise-vignette: 0.68;
}
```

### もっと静かに
`--noise-opacity: 0.20;`

### もっとザラつかせる
`--noise-opacity: 0.44; --noise-contrast: 1.20;`

## 重なり順

背景は `z-index: -1` です。既存サイトでbody背景や積層コンテキストの関係で見えない場合は `.hf-noise-back { z-index: 0; }` にして、メインコンテンツ側へ `position: relative; z-index: 1;` を指定してください。

## HyperFrames

`hyperframes-composition.html` は12秒の1920×1080 HyperFrames互換コンポジションです。無限リピートを使わず、決定論的なノイズで構成しています。

## ファイル

- `index.html` — ブラウザ確認用デモ
- `noise-background.css` — サイト用CSS
- `noise-background.js` — サイト用ノイズ描画
- `hyperframes-composition.html` — HyperFrames用コンポジション
- `DESIGN.md` — ビジュアル定義
