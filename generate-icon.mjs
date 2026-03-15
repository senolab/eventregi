import sharp from 'sharp';

// SVG with "イベントレジ" text, pink gradient background, ¥ symbol
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2ecc71"/>
      <stop offset="100%" style="stop-color:#1aab5a"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <!-- イベレジ outlined text (stroke + fill) -->
  <text x="256" y="235" font-family="'Hiragino Sans', 'Noto Sans JP', 'Arial', sans-serif" font-size="108" font-weight="900" text-anchor="middle"
    stroke="white" stroke-width="14" stroke-linejoin="round" fill="url(#bg)" paint-order="stroke">イベント</text>
  <text x="256" y="385" font-family="'Hiragino Sans', 'Noto Sans JP', 'Arial', sans-serif" font-size="108" font-weight="900" text-anchor="middle"
    stroke="white" stroke-width="14" stroke-linejoin="round" fill="url(#bg)" paint-order="stroke">レジ</text>
</svg>`;

const svgBuffer = Buffer.from(svgIcon);

await sharp(svgBuffer).resize(192, 192).png().toFile('public/icon-192.png');
console.log('icon-192.png generated');

await sharp(svgBuffer).resize(512, 512).png().toFile('public/icon-512.png');
console.log('icon-512.png generated');
