import '@toast-ui/editor/dist/toastui-editor.css';
import './styles/main.css';

import Editor from '@toast-ui/editor';
import { t, getCurrentLang, getCurrentDir, setLang, getAvailableLanguages } from './i18n/index.js';
import { getFonts, loadFonts, applyFont } from './fonts.js';
import { exportToPdf, exportToImage } from './export.js';

let editor = null;
let currentFont = 'Noto Naskh Arabic';
let rtlEnabled = false;

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

  rtlEnabled = lang === 'ug-arabic';

  const fonts = getFonts();
  const languages = getAvailableLanguages();

  app.innerHTML = `
    <div class="app-shell">
      <div class="header">
        <div class="header-top">
          <div class="hero-copy">
            <span class="hero-badge">${t('ui.sourcePane')} · ${t('ui.previewPane')}</span>
            <h1 class="app-title">${t('ui.title')}</h1>
            <p class="app-subtitle">${t('ui.subtitle')}</p>
          </div>
          <div class="header-controls">
            <div class="control-group">
              <label for="lang-select">${t('ui.language')}</label>
              <select id="lang-select">
                ${languages.map((l) => `<option value="${l.code}" ${l.code === lang ? 'selected' : ''}>${l.label}</option>`).join('')}
              </select>
            </div>
            <div class="control-group">
              <label for="font-select">${t('ui.font')}</label>
              <select id="font-select">
                ${fonts.map((f) => `<option value="${f.name}" ${f.name === currentFont ? 'selected' : ''}>${f.name}</option>`).join('')}
              </select>
            </div>
            <div class="control-group">
              <label for="font-size">${t('ui.fontSize')}</label>
              <select id="font-size">
                <option value="14">14px</option>
                <option value="16" selected>16px</option>
                <option value="18">18px</option>
                <option value="20">20px</option>
                <option value="24">24px</option>
                <option value="28">28px</option>
              </select>
            </div>
            <div class="control-group rtl-toggle">
              <label for="rtl-checkbox">${t('ui.rtlMode')}</label>
              <input type="checkbox" id="rtl-checkbox" ${rtlEnabled ? 'checked' : ''}>
            </div>
            <div class="control-group export-buttons">
              <label>${t('ui.export')}</label>
              <div class="button-row">
                <button class="btn-export" id="btn-pdf">${t('ui.exportPdf')}</button>
                <button class="btn-export" id="btn-png">${t('ui.exportPng')}</button>
                <button class="btn-export" id="btn-jpg">${t('ui.exportJpg')}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="workspace">
        <div class="workspace-header">
          <div class="workspace-pane-label">${t('ui.sourcePane')}</div>
          <div class="workspace-pane-label">${t('ui.previewPane')}</div>
        </div>
        <div class="editor-container ${rtlEnabled ? 'editor-rtl' : ''}">
          <div id="editor"></div>
        </div>
      </div>
    </div>
  `;

  initEditor();
  bindEvents();
  applyFont(currentFont);
  applyFontSize(16);
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
  });

  editor.on('change', () => {
    const md = editor.getMarkdown();
    localStorage.setItem('ug-editor-content', md);
  });

  applyRtl(rtlEnabled);
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

function bindEvents() {
  document.getElementById('lang-select')?.addEventListener('change', (e) => {
    const savedContent = editor?.getMarkdown() || '';
    localStorage.setItem('ug-editor-content', savedContent);
    setLang(e.target.value);
    buildUI();
  });

  document.getElementById('font-select')?.addEventListener('change', (e) => {
    currentFont = e.target.value;
    applyFont(currentFont);
  });

  document.getElementById('font-size')?.addEventListener('change', (e) => {
    applyFontSize(parseInt(e.target.value, 10));
  });

  document.getElementById('rtl-checkbox')?.addEventListener('change', (e) => {
    rtlEnabled = e.target.checked;
    applyRtl(rtlEnabled);
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
