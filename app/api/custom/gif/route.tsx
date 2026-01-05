import { NextRequest } from 'next/server';
import puppeteer, { Browser, Page } from 'puppeteer-core';
// @ts-ignore
import GIFEncoder from 'gif-encoder-2';
import { createCanvas, loadImage } from 'canvas';

export const runtime = 'nodejs';
export const maxDuration = 30;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getChromium() {
  if (process.env.VERCEL) {
    const chromium = await import('@sparticuz/chromium-min');
    return {
      args: chromium.default.args,
      executablePath: await chromium.default.executablePath(
        'https://github.com/Sparticuz/chromium/releases/download/v119.0.2/chromium-v119.0.2-pack.tar'
      ),
    };
  }

  return {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
    executablePath: process.env.CHROME_PATH ||
      (process.platform === 'win32'
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        : process.platform === 'darwin'
          ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
          : '/usr/bin/google-chrome'),
  };
}

export async function GET(request: NextRequest) {
  let browser: Browser | null = null;

  try {
    const searchParams = request.nextUrl.searchParams;

    const html = searchParams.get('html') || '<div style="color: white; font-size: 48px; text-align: center; padding-top: 150px;">Hello World</div>';
    const css = searchParams.get('css') || '';
    const width = parseInt(searchParams.get('width') || '800');
    const height = parseInt(searchParams.get('height') || '400');
    const duration = parseInt(searchParams.get('duration') || '3');
    const fps = parseInt(searchParams.get('fps') || '30');
    const bg = searchParams.get('bg') || '#050505';

    const totalFrames = duration * fps;
    const frameDelay = 1000 / fps; // ms entre frames

    // HTML con animaciones FORZADAS a iniciar
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      width: ${width}px;
      height: ${height}px;
      background: ${bg};
      overflow: hidden;
      font-family: 'Inter', sans-serif;
    }
    
    /* Asegurar que las animaciones corren */
    * {
      animation-play-state: running !important;
    }
    
    ${css}
  </style>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
  ${html}
  
  <script>
    // Forzar inicio de animaciones
    document.addEventListener('DOMContentLoaded', () => {
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.animationName !== 'none') {
          el.style.animationPlayState = 'running';
        }
      });
    });
  </script>
</body>
</html>
    `;

    console.log('🚀 Iniciando generación de GIF...');
    const chromiumConfig = await getChromium();

    browser = await puppeteer.launch({
      args: chromiumConfig.args,
      defaultViewport: { width, height },
      executablePath: chromiumConfig.executablePath,
      headless: true,
    });

    const page: Page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    // IMPORTANTE: Esperar a que las animaciones se inicialicen
    console.log('⏳ Esperando que las animaciones inicien...');
    await wait(500);

    const encoder = new GIFEncoder(width, height);

    encoder.setDelay(frameDelay);
    encoder.setRepeat(0); // Loop infinito
    encoder.setQuality(10);

    encoder.start();

    console.log(`🎬 Capturando ${totalFrames} frames @ ${fps}fps (${duration}s)`);

    // Capturar frames con timing preciso
    const startTime = Date.now();

    for (let i = 0; i < totalFrames; i++) {
      // Capturar screenshot
      const screenshotBuffer = await page.screenshot({
        type: 'png',
        clip: { x: 0, y: 0, width, height },
      });

      const screenshot = Buffer.from(screenshotBuffer);
      const img = await loadImage(screenshot);

      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, width, height);
      encoder.addFrame(imageData.data);

      if (i % 10 === 0) {
        console.log(`📸 Frame ${i + 1}/${totalFrames} (${((i / totalFrames) * 100).toFixed(1)}%)`);
      }

      // Esperar para el siguiente frame
      // Esto permite que las animaciones CSS progresen
      await wait(frameDelay);
    }

    const captureTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`⏱️  Captura completada en ${captureTime}s`);

    encoder.finish();
    await browser.close();

    const gifBuffer = encoder.out.getData();
    const sizeKB = (gifBuffer.length / 1024).toFixed(2);

    console.log(`✅ GIF generado: ${sizeKB} KB`);

    return new Response(gifBuffer, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'public, max-age=86400',
        'Content-Length': gifBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('❌ Error:', error);

    if (browser) await browser.close();

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    const errorSvg = `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="400" fill="#1a1a1a"/>
  <text x="400" y="160" text-anchor="middle" fill="#ff4444" font-size="24" font-weight="bold">
    Error generating GIF
  </text>
  <text x="400" y="200" text-anchor="middle" fill="#ffffff" font-size="14">
    ${errorMessage.substring(0, 80)}
  </text>
  <text x="400" y="230" text-anchor="middle" fill="#888888" font-size="12">
    Environment: ${process.env.VERCEL ? 'Vercel' : 'Local'}
  </text>
</svg>`;

    return new Response(errorSvg, {
      status: 500,
      headers: { 'Content-Type': 'image/svg+xml' },
    });
  }
}