import { toPng, getFontEmbedCSS } from 'html-to-image';

/**
 * Експорт блоку розсадки в PNG (html-to-image). Тимчасові стилі для світлого фону в dark mode.
 */
export async function downloadSeatingAsPng(el: HTMLElement, downloadFilename: string): Promise<void> {
  const captureClass = 'mafia-seating-png-capture';
  const styleEl = document.createElement('style');
  styleEl.setAttribute('data-mafia-seating-capture', '1');
  styleEl.textContent = `
      .${captureClass} {
        background-color: #ffffff !important;
        color: #0f172a !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .${captureClass}, .${captureClass} * {
        color: #0f172a !important;
        -webkit-text-fill-color: #0f172a !important;
      }
      .${captureClass} .MuiPaper-root {
        background-color: #fafafa !important;
        border-color: rgba(15, 23, 42, 0.28) !important;
        color: #0f172a !important;
      }
      .${captureClass} .MuiDivider-root {
        border-color: rgba(15, 23, 42, 0.12) !important;
      }
      .${captureClass} .MuiBox-root {
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial, sans-serif !important;
      }
    `;
  document.head.appendChild(styleEl);
  el.classList.add(captureClass);
  try {
    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    const fontEmbedCSS = await getFontEmbedCSS(el, { cacheBust: true });
    const dataUrl = await toPng(el, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      cacheBust: true,
      fontEmbedCSS,
      preferredFontFormat: 'woff2',
    });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = downloadFilename;
    a.click();
  } finally {
    el.classList.remove(captureClass);
    styleEl.remove();
  }
}
