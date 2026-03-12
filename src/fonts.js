const CORE_FONTS = [
  { name: 'ALKATIP Basma', file: 'ALKATIP Basma.TTF' },
  { name: 'ALKATIP Basma Bold', file: 'ALKATIP Basma Bold.TTF', weight: 700 },
  { name: 'ALKATIP Basma Tom', file: 'ALKATIP Basma Tom.TTF' },
  { name: 'ALKATIP Basma Tom Bold', file: 'ALKATIP Basma Tom Bold.TTF', weight: 700 },
  { name: 'ALKATIP Gezit', file: 'ALKATIP Gezit.TTF' },
  { name: 'ALKATIP Gezit Tom', file: 'ALKATIP Gezit Tom.TTF' },
  { name: 'ALKATIP Jornal', file: 'ALKATIP Jornal.TTF' },
  { name: 'ALKATIP Jornal Tom', file: 'ALKATIP Jornal Tom.TTF' },
  { name: 'ALKATIP Kitab', file: 'ALKATIP Kitab.TTF' },
  { name: 'ALKATIP Kitab Tom', file: 'ALKATIP Kitab Tom.TTF' },
  { name: 'ALKATIP Kufi', file: 'ALKATIP Kufi.TTF' },
  { name: 'ALKATIP Marka', file: 'ALKATIP Marka.TTF' },
  { name: 'ALKATIP Pinyin', file: 'ALKATIP Pinyin.TTF' },
  { name: 'ALKATIP Rukki', file: 'ALKATIP Rukki.TTF' },
  { name: 'ALKATIP Talik', file: 'ALKATIP Talik.TTF' },
  { name: 'ALKATIP Tor', file: 'ALKATIP Tor.TTF' },
  { name: 'ALKATIP Tor Tom', file: 'ALKATIP Tor Tom.TTF' },
  { name: 'ALKATIP Yazma', file: 'ALKATIP Yazma.TTF' },
  { name: 'ALKATIP Yazma Tom', file: 'ALKATIP Yazma Tom.TTF' },
  { name: 'ALKATIP Asliya', file: 'ALKATIP Asliya.TTF' },
  { name: 'ALKATIP Asliya 2', file: 'ALKATIP Asliya 2.TTF' },
  { name: 'ALKATIP', file: 'ALKATIP.TTF' },
];

const FONT_DEFINITIONS = [
  ...CORE_FONTS.map((font) => ({
    name: font.name,
    family: `"${font.name}", "Noto Naskh Arabic", serif`,
    files: [
      {
        weight: font.weight || 400,
        ttf: new URL(`./ug-fonts/${font.file}`, import.meta.url),
      },
    ],
  })),
  {
    name: 'Noto Naskh Arabic',
    family: '"Noto Naskh Arabic", serif',
    files: [
      {
        weight: 400,
        woff2: new URL('./ug-fonts/noto-naskh-arabic-arabic-400-normal.woff2', import.meta.url),
        woff: new URL('./ug-fonts/noto-naskh-arabic-arabic-400-normal.woff', import.meta.url),
      },
      {
        weight: 700,
        woff2: new URL('./ug-fonts/noto-naskh-arabic-arabic-700-normal.woff2', import.meta.url),
        woff: new URL('./ug-fonts/noto-naskh-arabic-arabic-700-normal.woff', import.meta.url),
      },
    ],
  },
];

const FONTS = FONT_DEFINITIONS.map(({ name, family }) => ({
  name,
  family,
  type: 'bundled',
}));

let fontsLoaded = false;

export function getFonts() {
  return FONTS;
}

export function loadFonts() {
  if (fontsLoaded) return;
  fontsLoaded = true;

  const style = document.createElement('style');
  let css = '';

  for (const font of FONT_DEFINITIONS) {
    for (const file of font.files) {
      const sources = [
        file.woff2 && `url(${file.woff2}) format('woff2')`,
        file.woff && `url(${file.woff}) format('woff')`,
        file.ttf && `url(${file.ttf}) format('truetype')`,
      ]
        .filter(Boolean)
        .join(',\n      ');

      css += `
      @font-face {
        font-family: ${font.family};
        src: ${sources};
        font-weight: ${file.weight};
        font-style: normal;
        font-display: swap;
      }
      `;
    }
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
