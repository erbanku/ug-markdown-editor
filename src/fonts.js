import '@fontsource/noto-naskh-arabic/400.css';
import '@fontsource/noto-naskh-arabic/700.css';

const FONTS = [
  { name: 'Default', family: 'system-ui, sans-serif', type: 'system' },
  { name: 'UKIJ Tuz', family: '"UKIJ Tuz"', type: 'uyghur' },
  { name: 'UKIJ Tuz Tom', family: '"UKIJ Tuz Tom"', type: 'uyghur' },
  { name: 'UKIJ Basma', family: '"UKIJ Basma"', type: 'uyghur' },
  { name: 'UKIJ Kufi', family: '"UKIJ Kufi"', type: 'uyghur' },
  { name: 'UKIJ Nastaliq', family: '"UKIJ Nastaliq"', type: 'uyghur' },
  { name: 'UKIJ Diwani', family: '"UKIJ Diwani"', type: 'uyghur' },
  { name: 'UKIJ Qolyazma', family: '"UKIJ Qolyazma"', type: 'uyghur' },
  { name: 'Alkatip Asliye', family: '"ALKATIP Asliye"', type: 'uyghur' },
  { name: 'Noto Naskh Arabic', family: '"Noto Naskh Arabic", serif', type: 'bundled' },
];

let fontsLoaded = false;

export function getFonts() {
  return FONTS;
}

export function loadFonts() {
  if (fontsLoaded) return;
  fontsLoaded = true;

  const fontFormats = [
    { ext: 'woff2', format: 'woff2' },
    { ext: 'woff', format: 'woff' },
    { ext: 'ttf', format: 'truetype' },
  ];

  const style = document.createElement('style');
  let css = '';

  const uyghurFonts = FONTS.filter((f) => f.type === 'uyghur');
  for (const font of uyghurFonts) {
    const baseName = font.name.replace(/\s+/g, '-');
    const sources = fontFormats
      .map((fmt) => `url('./fonts/${baseName}.${fmt.ext}') format('${fmt.format}')`)
      .join(',\n      ');
    css += `
    @font-face {
      font-family: ${font.family};
      src: ${sources};
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    `;
  }

  style.textContent = css;
  document.head.appendChild(style);

}

export function applyFont(fontName) {
  const font = FONTS.find((f) => f.name === fontName);
  if (!font) return;

  document.documentElement.style.setProperty('--app-font-family', font.family);

  const fontTargets = document.querySelectorAll(
    '.toastui-editor-contents, .ProseMirror, .toastui-editor-md-container textarea, .toastui-editor-md-text'
  );

  for (const target of fontTargets) {
    target.style.fontFamily = font.family;
  }
}
