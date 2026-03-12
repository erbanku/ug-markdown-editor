import '@toast-ui/editor/dist/toastui-editor.css';
import './styles/main.css';

import Editor from '@toast-ui/editor';
import { t, getCurrentLang, getCurrentDir, setLang, getAvailableLanguages } from './i18n/index.js';
import { getFonts, loadFonts, applyFont } from './fonts.js';
import { exportToPdf, exportToImage, exportToMarkdown } from './export.js';

let editor = null;
let currentFont = localStorage.getItem('ug-editor-font') || 'Noto Naskh Arabic';
let rtlEnabled = localStorage.getItem('ug-editor-rtl') === 'true';
let darkMode = localStorage.getItem('ug-editor-dark') === 'true';
let fontSize = parseInt(localStorage.getItem('ug-editor-font-size'), 10) || 16;

function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function buildUI() {
  const app = document.getElementById('app');
  const dir = getCurrentDir();
  const lang = getCurrentLang();

  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);
  document.title = t('ui.title');

  // Only set rtlEnabled from language default if the user has no saved preference
  if (localStorage.getItem('ug-editor-rtl') === null) {
    rtlEnabled = lang === 'ug-arabic';
  }

  const fonts = getFonts();
  const languages = getAvailableLanguages();
  if (fonts.length && !fonts.some((f) => f.name === currentFont)) {
    currentFont = fonts[0].name;
    localStorage.setItem('ug-editor-font', currentFont);
  }

  app.innerHTML = `
    <div class="page-shell">
      <header class="top-hero">
        <div class="hero-text">
          <p class="eyebrow">${t('ui.previewPane')}</p>
          <h1 class="hero-title">${t('ui.title')}</h1>
          <p class="hero-sub">${t('ui.editorPlaceholder')}</p>
          <div class="stat-pills">
            <span class="pill word-count" id="word-count" aria-live="polite">0 ${t('ui.wordCount')} · 0 ${t('ui.charCount')}</span>
            <span class="pill">${t('ui.sourcePane')}</span>
            <span class="pill">${t('ui.previewPane')}</span>
          </div>
        </div>
        <div class="hero-actions">
          <button class="btn-primary" id="btn-pdf">${t('ui.exportPdf')}</button>
          <button class="btn-ghost" id="btn-md">${t('ui.exportMd')}</button>
        </div>
      </header>

      <div class="main-grid">
        <aside class="control-panel">
          <div class="control-card">
            <div class="control-header">
              <h3>${t('ui.language')}</h3>
              <label class="toggle">
                <input type="checkbox" id="rtl-checkbox" ${rtlEnabled ? 'checked' : ''}>
                <span>${t('ui.rtlMode')}</span>
              </label>
            </div>
            <select id="lang-select">
              ${languages.map((l) => `<option value="${l.code}" ${l.code === lang ? 'selected' : ''}>${l.label}</option>`).join('')}
            </select>
          </div>

          <div class="control-card">
            <h3>${t('ui.font')}</h3>
            <select id="font-select">
              ${fonts.map((f) => `<option value="${f.name}" ${f.name === currentFont ? 'selected' : ''}>${f.name}</option>`).join('')}
            </select>
            <h3 class="stacked">${t('ui.fontSize')}</h3>
            <select id="font-size">
              <option value="14" ${fontSize === 14 ? 'selected' : ''}>14px</option>
              <option value="16" ${fontSize === 16 ? 'selected' : ''}>16px</option>
              <option value="18" ${fontSize === 18 ? 'selected' : ''}>18px</option>
              <option value="20" ${fontSize === 20 ? 'selected' : ''}>20px</option>
              <option value="24" ${fontSize === 24 ? 'selected' : ''}>24px</option>
              <option value="28" ${fontSize === 28 ? 'selected' : ''}>28px</option>
            </select>
          </div>

          <div class="control-card">
            <h3>${t('ui.darkMode')}</h3>
            <label class="toggle">
              <input type="checkbox" id="dark-mode-checkbox" ${darkMode ? 'checked' : ''}>
              <span>${t('ui.darkMode')}</span>
            </label>
          </div>

          <div class="control-card">
            <h3>${t('ui.export')}</h3>
            <div class="export-grid">
              <button class="btn-surface" id="btn-png">${t('ui.exportPng')}</button>
              <button class="btn-surface" id="btn-jpg">${t('ui.exportJpg')}</button>
            </div>
            <button class="btn-surface secondary" id="btn-clear">${t('ui.clearEditor')}</button>
          </div>
        </aside>

        <section class="editor-surface">
          <div class="editor-meta">
            <div>
              <p class="eyebrow">${t('ui.sourcePane')}</p>
              <h2 class="editor-title">${t('ui.previewPane')}</h2>
            </div>
          </div>
          <div class="editor-frame editor-container ${rtlEnabled ? 'editor-rtl' : ''}">
            <div id="editor"></div>
          </div>
        </section>
      </div>
    </div>
  `;

  applyDarkMode(darkMode);
  initEditor();
  bindEvents();
  applyFont(currentFont);
  applyFontSize(fontSize);
}

function applyEditorStyles(styles) {
  const targets = document.querySelectorAll(
    '.toastui-editor-contents, .ProseMirror, .toastui-editor-md-container textarea, .toastui-editor-md-text'
  );

  for (const target of targets) {
    Object.entries(styles).forEach(([key, value]) => {
      target.style[key] = value;
    });
  }
}

function initEditor() {
  const editorEl = document.getElementById('editor');
  if (!editorEl) return;

  const savedContent = localStorage.getItem('ug-editor-content') || '';

  editor = new Editor({
    el: editorEl,
    height: '100%',
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    hideModeSwitch: true,
    initialValue: savedContent || `# ${t('ui.title')}\n\n${t('ui.editorPlaceholder')}`,
    usageStatistics: false,
    toolbarItems: [
      ['heading', 'bold', 'italic', 'strike'],
      ['hr', 'quote'],
      ['ul', 'ol', 'task', 'indent', 'outdent'],
      ['table', 'link'],
      ['code', 'codeblock'],
    ],
    autofocus: false,
  });

  // Auto-save with debouncing and update word count
  let saveTimeout;
  editor.on('change', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      const md = editor.getMarkdown();
      localStorage.setItem('ug-editor-content', md);
      updateWordCount(md);
    }, 500);
  });

  // Ensure the editor is properly initialized and focusable
  setTimeout(() => {
    applyRtl(rtlEnabled);
    updateWordCount(editor.getMarkdown());
    // Focus the editor after initialization
    try {
      const markdownEditor = document.querySelector('.toastui-editor-md-container .toastui-editor-md-text');
      if (markdownEditor) {
        markdownEditor.focus();
      }
    } catch (err) {
      console.warn('Could not focus editor:', err);
    }
  }, 100);
}

function applyRtl(enabled) {
  const container = document.querySelector('.editor-container');
  if (!container) return;

  container.classList.toggle('editor-rtl', enabled);

  applyEditorStyles({
    direction: enabled ? 'rtl' : 'ltr',
    textAlign: enabled ? 'right' : 'left',
  });

  const previewContent = document.querySelector('.toastui-editor-md-preview .toastui-editor-contents');
  if (previewContent) {
    previewContent.style.direction = enabled ? 'rtl' : 'ltr';
    previewContent.style.textAlign = enabled ? 'right' : 'left';
  }
}

function applyFontSize(size) {
  applyEditorStyles({ fontSize: `${size}px` });
}

function applyDarkMode(enabled) {
  document.documentElement.classList.toggle('dark-mode', enabled);
}

function updateWordCount(markdown) {
  const el = document.getElementById('word-count');
  if (!el) return;
  const text = markdown.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(/\s+/).length : 0;
  const chars = markdown.length;
  el.textContent = `${words} ${t('ui.wordCount')} · ${chars} ${t('ui.charCount')}`;
}

function bindEvents() {
  document.getElementById('lang-select')?.addEventListener('change', (e) => {
    const savedContent = editor?.getMarkdown() || '';
    localStorage.setItem('ug-editor-content', savedContent);
    setLang(e.target.value);
    buildUI();
  });

  document.getElementById('font-select')?.addEventListener('change', (e) => {
    currentFont = e.target.value;
    localStorage.setItem('ug-editor-font', currentFont);
    applyFont(currentFont);
  });

  document.getElementById('font-size')?.addEventListener('change', (e) => {
    fontSize = parseInt(e.target.value, 10);
    localStorage.setItem('ug-editor-font-size', fontSize);
    applyFontSize(fontSize);
  });

  document.getElementById('rtl-checkbox')?.addEventListener('change', (e) => {
    rtlEnabled = e.target.checked;
    localStorage.setItem('ug-editor-rtl', rtlEnabled);
    applyRtl(rtlEnabled);
  });

  document.getElementById('dark-mode-checkbox')?.addEventListener('change', (e) => {
    darkMode = e.target.checked;
    localStorage.setItem('ug-editor-dark', darkMode);
    applyDarkMode(darkMode);
  });

  document.getElementById('btn-pdf')?.addEventListener('click', async () => {
    try {
      showToast(t('ui.exporting'), 'success');
      await exportToPdf();
      showToast(t('ui.exportSuccess'), 'success');
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast(t('ui.exportError'), 'error');
    }
  });

  document.getElementById('btn-png')?.addEventListener('click', async () => {
    try {
      showToast(t('ui.exporting'), 'success');
      await exportToImage('png');
      showToast(t('ui.exportSuccess'), 'success');
    } catch (err) {
      console.error('PNG export failed:', err);
      showToast(t('ui.exportError'), 'error');
    }
  });

  document.getElementById('btn-jpg')?.addEventListener('click', async () => {
    try {
      showToast(t('ui.exporting'), 'success');
      await exportToImage('jpg');
      showToast(t('ui.exportSuccess'), 'success');
    } catch (err) {
      console.error('JPG export failed:', err);
      showToast(t('ui.exportError'), 'error');
    }
  });

  document.getElementById('btn-md')?.addEventListener('click', async () => {
    try {
      const markdown = editor?.getMarkdown() || '';
      await exportToMarkdown(markdown);
      showToast(t('ui.exportSuccess'), 'success');
    } catch (err) {
      console.error('Markdown export failed:', err);
      showToast(t('ui.exportError'), 'error');
    }
  });

  document.getElementById('btn-clear')?.addEventListener('click', () => {
    if (window.confirm(t('ui.clearConfirm'))) {
      editor?.setMarkdown('');
      localStorage.removeItem('ug-editor-content');
    }
  });
}

function init() {
  loadFonts();
  buildUI();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
