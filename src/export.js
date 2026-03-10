import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import DOMPurify from 'dompurify';

function getEditorContentElement() {
  return document.querySelector('.toastui-editor-contents');
}

function createExportContainer(contentEl) {
  const container = document.createElement('div');
  container.style.cssText =
    'position:absolute;left:-9999px;top:0;background:#fff;padding:40px;width:800px;';
  container.innerHTML = DOMPurify.sanitize(contentEl.innerHTML);

  const computedStyle = window.getComputedStyle(contentEl);
  container.style.fontFamily = computedStyle.fontFamily;
  container.style.direction = computedStyle.direction;
  container.style.textAlign = computedStyle.textAlign;

  document.body.appendChild(container);
  return container;
}

export async function exportToPdf() {
  const contentEl = getEditorContentElement();
  if (!contentEl) throw new Error('Editor content not found');

  const container = createExportContainer(contentEl);
  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;

    while (heightLeft > 0) {
      position = -(pageHeight - margin * 2 - (imgHeight - heightLeft)) + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;
    }

    pdf.save('document.pdf');
  } finally {
    document.body.removeChild(container);
  }
}

export async function exportToImage(format = 'png') {
  const contentEl = getEditorContentElement();
  if (!contentEl) throw new Error('Editor content not found');

  const container = createExportContainer(contentEl);
  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const quality = format === 'jpg' ? 0.95 : undefined;

    const link = document.createElement('a');
    link.download = `document.${format}`;
    link.href = canvas.toDataURL(mimeType, quality);
    link.click();
  } finally {
    document.body.removeChild(container);
  }
}
