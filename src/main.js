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

  app.innerHTML = `
    <div class="app-shell">
      <div class="app-header">
        <div class="app-branding">
          <h1 class="app-title">${t('ui.title')}</h1>
          <span class="app-mode-badge">${t('ui.sourcePane')} · ${t('ui.previewPane')}</span>
        </div>
        <div class="header-actions">
          <span class="word-count" id="word-count" aria-live="polite"></span>
          <button class="settings-toggle" id="settings-toggle" aria-label="Settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m5.66-15.66l-4.24 4.24m0 6.84l-4.24 4.24M23 12h-6m-6 0H1m15.66 5.66l-4.24-4.24m0-6.84l-4.24-4.24"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="settings-panel" id="settings-panel">
        <div class="settings-content">
          <div class="settings-section">
            <h3 class="settings-title">${t('ui.language')}</h3>
            <select id="lang-select">
              ${languages.map((l) => `<option value="${l.code}" ${l.code === lang ? 'selected' : ''}>${l.label}</option>`).join('')}
            </select>
          </div>

          <div class="settings-section">
            <h3 class="settings-title">${t('ui.font')}</h3>
            <select id="font-select">
              ${fonts.map((f) => `<option value="${f.name}" ${f.name === currentFont ? 'selected' : ''}>${f.name}</option>`).join('')}
            </select>
          </div>

          <div class="settings-section">
            <h3 class="settings-title">${t('ui.fontSize')}</h3>
            <select id="font-size">
              <option value="14">14px</option>
              <option value="16" selected>16px</option>
              <option value="18">18px</option>
              <option value="20">20px</option>
              <option value="24">24px</option>
              <option value="28">28px</option>
            </select>
          </div>

          <div class="settings-section">
            <label class="checkbox-label">
              <input type="checkbox" id="rtl-checkbox" ${rtlEnabled ? 'checked' : ''}>
              <span>${t('ui.rtlMode')}</span>
            </label>
          </div>

          <div class="settings-section">
            <label class="checkbox-label">
              <input type="checkbox" id="dark-mode-checkbox" ${darkMode ? 'checked' : ''}>
              <span>${t('ui.darkMode')}</span>
            </label>
          </div>

          <div class="settings-section">
            <h3 class="settings-title">${t('ui.export')}</h3>
            <div class="export-buttons">
              <button class="btn-export" id="btn-pdf">${t('ui.exportPdf')}</button>
              <button class="btn-export" id="btn-png">${t('ui.exportPng')}</button>
              <button class="btn-export" id="btn-jpg">${t('ui.exportJpg')}</button>
              <button class="btn-export" id="btn-md">${t('ui.exportMd')}</button>
            </div>
          </div>

          <div class="settings-section">
            <button class="btn-clear" id="btn-clear">${t('ui.clearEditor')}</button>
          </div>
        </div>
      </div>

      <div class="editor-container ${rtlEnabled ? 'editor-rtl' : ''}">
        <div id="editor"></div>
      </div>
    </div>
  `;

  applyDarkMode(darkMode);
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
  const settingsToggle = document.getElementById('settings-toggle');
  const settingsPanel = document.getElementById('settings-panel');

  settingsToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = settingsPanel.classList.contains('open');
    settingsPanel.classList.toggle('open', !isOpen);
    settingsToggle.setAttribute('aria-expanded', !isOpen);
  });

  // Close settings when clicking outside
  document.addEventListener('click', (e) => {
    // Don't interfere with editor interactions
    const editorContainer = document.querySelector('.editor-container');
    if (editorContainer?.contains(e.target)) {
      return;
    }

    if (!settingsPanel?.contains(e.target) && !settingsToggle?.contains(e.target)) {
      settingsPanel?.classList.remove('open');
      settingsToggle?.setAttribute('aria-expanded', 'false');
    }
  });

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
    applyFontSize(parseInt(e.target.value, 10));
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

