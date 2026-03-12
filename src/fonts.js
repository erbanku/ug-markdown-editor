const FONT_DEFINITIONS = [
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
      const sources = [file.woff2 && `url(${file.woff2}) format('woff2')`, file.woff && `url(${file.woff}) format('woff')`]
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
