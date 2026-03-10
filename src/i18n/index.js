import en from './en.js';
import ugLatin from './ug-latin.js';
import ugArabic from './ug-arabic.js';
import zh from './zh.js';

const locales = {
  en,
  'ug-latin': ugLatin,
  'ug-arabic': ugArabic,
  zh,
};

let currentLang = localStorage.getItem('ug-editor-lang') || 'ug-arabic';

export function t(key) {
  if (!key || typeof key !== 'string') return key;
  const locale = locales[currentLang];
  if (!locale) return key;
  const keys = key.split('.');
  let val = locale;
  for (const k of keys) {
    val = val?.[k];
  }
  return val || key;
}

export function getCurrentLang() {
  return currentLang;
}

export function getCurrentDir() {
  return locales[currentLang]?.dir || 'ltr';
}

export function setLang(lang) {
  if (locales[lang]) {
    currentLang = lang;
    localStorage.setItem('ug-editor-lang', lang);
  }
}

export function getAvailableLanguages() {
  return Object.entries(locales).map(([key, val]) => ({
    code: key,
    label: val.label,
    dir: val.dir,
  }));
}
