# Uyghur Markdown Editor

A browser-based, no-login WYSIWYG Markdown editor with export capabilities and comprehensive Uyghur font support.

---

[English](#english) | [Uyghurche (Latin)](#uyghurche-latin) | [ئۇيغۇرچە](#uyghurche-arabic) | [简体中文](#simplified-chinese)

---

## English

### Description

Uyghur Markdown Editor is a client-side WYSIWYG Markdown editor designed for multilingual content creation with specialized support for the Uyghur language. It runs entirely in the browser with no backend server or authentication required.

### Features

- Real-time WYSIWYG Markdown editing with live preview
- Export to PDF format
- Export to image formats (PNG, JPG)
- Full RTL (Right-to-Left) text rendering support
- Bidirectional text handling (mixed LTR/RTL content)
- 10 embedded fonts including Uyghur-specific fonts
- In-editor font selector with adjustable font sizes
- 4-language interface (English, Uyghur Latin, Uyghur Arabic, Simplified Chinese)
- Language switching without page reload
- Auto-save content to local storage
- No authentication required
- Fully client-side (no server needed)
- Mobile-responsive design

### Technology Stack

- Vite - Build tool and development server
- Toast UI Editor - WYSIWYG Markdown editor
- html2canvas - HTML to canvas rendering for image export
- jsPDF - PDF generation
- Vanilla JavaScript (ES Modules)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/erbanku/ug-markdown-editor.git
cd ug-markdown-editor
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

5. Preview the production build:

```bash
npm run preview
```

### Usage

1. Open the editor in your browser
2. Select your preferred language from the language dropdown
3. Choose a font from the font selector
4. Adjust font size as needed
5. Toggle RTL mode for right-to-left text entry
6. Write your content using the WYSIWYG editor or Markdown syntax
7. Export your document as PDF, PNG, or JPG using the export buttons

### Font Support

The editor supports the following fonts:

1. Default (System font)
2. UKIJ Tuz
3. UKIJ Tuz Tom
4. UKIJ Basma
5. UKIJ Kufi
6. UKIJ Nastaliq
7. UKIJ Diwani
8. UKIJ Qolyazma
9. ALKATIP Asliye
10. Noto Naskh Arabic

To use Uyghur fonts, place the font files (in WOFF2, WOFF, or TTF format) in the `public/fonts/` directory. Font files should be named to match the font name with hyphens replacing spaces (e.g., `UKIJ-Tuz.woff2`).

### Font Licensing

- UKIJ fonts are part of the Alkatip font family. Please refer to the original font license for usage terms.
- Noto Naskh Arabic is part of the Google Noto font family, available under the SIL Open Font License.

### Browser Compatibility

- Google Chrome (latest)
- Mozilla Firefox (latest)
- Apple Safari (latest)
- Microsoft Edge (latest)

---

## Uyghurche (Latin)

### Chushenduresh

Uyghurche Markdown Tehrirliguchi bolsa, torda ishlaydighan, kirishke hajetsiz WYSIWYG Markdown tehrirliguchi bolup, Uyghur tili qollishigha alahide ehmiyyet bergen. U puxten mushtiri terepte ishlaydu, arqa mulazimet yaki tesdiqqa hajiti yoq.

### Alahidilikliri

- Heqiqiy waqittiki WYSIWYG Markdown tehrirleysh we aldal koresh
- PDF formatigha chiqirish
- Resim formatigha chiqirish (PNG, JPG)
- Tolaq RTL (Onggdin Solgha) teksit korsetish qolleyshi
- Ikki yonilishliq teksit bir terep qilish (arilash LTR/RTL mezmun)
- 10 orun'algan xet, jümlidin Uyghurchigha xas xetler
- Tehrirliguchidiki xet tallash we xet chongliqini tengshesh
- 4 tildiki koyuzu (Englizche, Uyghurche Latin, Uyghurche Ereb, Xenzuche)
- Betni qayta yuklimey til almashturush
- Yerlik ambiarda mezmunni aptumatik saqlash
- Tesdiq taliw yoq
- Puxten mushtiri terepte (mulazimet hajiti yoq)
- Kochme jihazgha maslashqan dizayn

### Qurush

1. Amberni klonlang:

```bash
git clone https://github.com/erbanku/ug-markdown-editor.git
cd ug-markdown-editor
```

2. Teweliklerni orniting:

```bash
npm install
```

3. Tereqqiyat mulazimiitini qozghiting:

```bash
npm run dev
```

4. Ishlewge hazirlang:

```bash
npm run build
```

### Ishletish

1. Tehrirliguchni torkoresh programisida eching
2. Til tallash ramkisidin oz yaqturghiningizni tallang
3. Xet tallash ramkisidin bir xet tallang
4. Lazim bolghan chaghdiki xet chongliqini tengsheng
5. Onggdin solgha teksit kirguzush uchun RTL halitini almashturang
6. WYSIWYG tehrirliguchi yaki Markdown grammatikisi arqiliq mezmun yezing
7. Chiqirish tugmiliri arqiliq hojjetingizni PDF, PNG yaki JPG qilip chiqiring

---

## Uyghurche (Arabic)

### چۈشەندۈرۈش

ئۇيغۇرچە Markdown تەھرىرلىگۈچى بولسا، توردا ئىشلەيدىغان، كىرىشكە ھاجەتسىز WYSIWYG Markdown تەھرىرلىگۈچى بولۇپ، ئۇيغۇر تىلى قوللىشىغا ئالاھىدە ئەھمىيەت بەرگەن. ئۇ پۈتۈن مۇشتەرى تەرەپتە ئىشلەيدۇ، ئارقا مۇلازىمەت ياكى تەستىققا ھاجىتى يوق.

### ئالاھىدىلىكلىرى

- ھەقىقىي ۋاقىتتىكى WYSIWYG Markdown تەھرىرلەيش ۋە ئالدال كۆرەش
- PDF فورماتىغا چىقىرىش
- رەسىم فورماتىغا چىقىرىش (PNG, JPG)
- تولۇق RTL (ئوڭدىن سولغا) تېكىست كۆرسىتىش قوللەيشى
- ئىككى يۆنىلىشلىق تېكىست بىر تەرەپ قىلىش
- 10 ئورۇنئالغان خەت، جۈملىدىن ئۇيغۇرچىغا خاس خەتلەر
- تەھرىرلىگۈچىدىكى خەت تاللاش ۋە خەت چوڭلۇقىنى تەڭشەش
- 4 تىلدىكى كۆيۈزى (ئىنگلىزچە، ئۇيغۇرچە لاتىن، ئۇيغۇرچە ئەرەب، خەنزۇچە)
- بەتنى قايتا يۈكلىمەي تىل ئالماشتۇرۇش
- يەرلىك ئامبارغا مەزمۇننى ئاپتوماتىك ساقلاش
- تەستىق تەلەپ يوق
- پۈتۈن مۇشتەرى تەرەپتە (مۇلازىمەت ھاجىتى يوق)
- كۆچمە جىھازغا ماسلاشقان دىزايىن

### قۇرۇش

1. ئامبەرنى كلونلاڭ:

```bash
git clone https://github.com/erbanku/ug-markdown-editor.git
cd ug-markdown-editor
```

2. تەۋەلىكلەرنى ئورنىتىڭ:

```bash
npm install
```

3. تەرەققىيات مۇلازىمىتىنى قوزغىتىڭ:

```bash
npm run dev
```

4. ئىشلەۋگە ھازىرلاڭ:

```bash
npm run build
```

### ئىشلىتىش

1. تەھرىرلىگۈچنى تورقىلىنغۇچ پروگراممىسىدا ئېچىڭ
2. تىل تاللاش رامكىسىدىن ئۆز ياقتۇرغىنىڭىزنى تاللاڭ
3. خەت تاللاش رامكىسىدىن بىر خەت تاللاڭ
4. لازىم بولغان چاغدا خەت چوڭلۇقىنى تەڭشەڭ
5. ئوڭدىن سولغا تېكىست كىرگۈزۈش ئۈچۈن RTL ھالىتىنى ئالماشتۇراڭ
6. WYSIWYG تەھرىرلىگۈچى ياكى Markdown گرامماتىكىسى ئارقىلىق مەزمۇن يېزىڭ
7. چىقىرىش تۈگمىلىرى ئارقىلىق ھۆججىتىڭىزنى PDF، PNG ياكى JPG قىلىپ چىقىرىڭ

---

## Simplified Chinese

### 说明

维吾尔语 Markdown 编辑器是一款基于浏览器的、无需登录的所见即所得 Markdown 编辑器，专为维吾尔语提供特殊支持。它完全在客户端运行，无需后端服务器或身份验证。

### 功能特点

- 实时所见即所得 Markdown 编辑和预览
- 导出为 PDF 格式
- 导出为图片格式（PNG、JPG）
- 完整的 RTL（从右到左）文本渲染支持
- 双向文本处理（混合 LTR/RTL 内容）
- 10 种内置字体，包括维吾尔语专用字体
- 编辑器内字体选择器和字号调节
- 4 种语言界面（英语、维吾尔语拉丁字母、维吾尔语阿拉伯字母、简体中文）
- 无需刷新页面即可切换语言
- 自动保存内容到本地存储
- 无需身份验证
- 完全客户端运行（无需服务器）
- 移动端响应式设计

### 技术栈

- Vite - 构建工具和开发服务器
- Toast UI Editor - 所见即所得 Markdown 编辑器
- html2canvas - HTML 渲染为画布，用于图片导出
- jsPDF - PDF 生成
- 原生 JavaScript（ES 模块）

### 安装

1. 克隆仓库：

```bash
git clone https://github.com/erbanku/ug-markdown-editor.git
cd ug-markdown-editor
```

2. 安装依赖：

```bash
npm install
```

3. 启动开发服务器：

```bash
npm run dev
```

4. 构建生产版本：

```bash
npm run build
```

5. 预览生产版本：

```bash
npm run preview
```

### 使用方法

1. 在浏览器中打开编辑器
2. 从语言下拉菜单中选择您偏好的语言
3. 从字体选择器中选择字体
4. 根据需要调整字号
5. 切换 RTL 模式以进行从右到左的文本输入
6. 使用所见即所得编辑器或 Markdown 语法编写内容
7. 使用导出按钮将文档导出为 PDF、PNG 或 JPG

### 字体许可

- UKIJ 字体属于 Alkatip 字体家族。请参阅原始字体许可证了解使用条款。
- Noto Naskh Arabic 属于 Google Noto 字体家族，采用 SIL 开源字体许可证。

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
