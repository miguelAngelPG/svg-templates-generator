import { NextRequest } from 'next/server';
import puppeteer, { Browser, Page } from 'puppeteer-core';
// @ts-ignore
import GIFEncoder from 'gif-encoder-2';
import { createCanvas, loadImage } from 'canvas';
import chromium from '@sparticuz/chromium';

export const runtime = 'nodejs';
export const maxDuration = 30;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getChromium() {
  if (process.env.VERCEL) {
    return {
      args: chromium.args,
      executablePath: await chromium.executablePath(
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

async function generateGif(params: { html: string, css: string, width: number, height: number, duration: number, fps: number, bg: string }) {
  let browser: Browser | null = null;
  const { html, css, width, height, duration, fps, bg } = params;

  try {
    const totalFrames = duration * fps;
    const frameDuration = duration * 1000;

    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: ${width}px; height: ${height}px; background: ${bg}; overflow: hidden; font-family: 'Inter', sans-serif; }
    ${css}
  </style>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
  ${html}
</body>
</html>`;

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
    await wait(1000);

    console.log('🎬 Pausando animaciones...');
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.innerHTML = `* { animation-play-state: paused !important; }`;
      document.head.appendChild(style);
      document.querySelectorAll('*').forEach((el: any) => {
        const computed = window.getComputedStyle(el);
        if (computed.animationName !== 'none') el.style.animationPlayState = 'paused';
      });
    });

    const encoder = new GIFEncoder(width, height);
    encoder.setDelay(1000 / fps);
    encoder.setRepeat(0);
    encoder.setQuality(10);
    encoder.start();

    console.log(`📸 Capturando ${totalFrames} frames @ ${fps}fps`);

    for (let i = 0; i < totalFrames; i++) {
      const progress = i / (totalFrames - 1);
      const timeMs = progress * frameDuration;

      await page.evaluate((time) => {
        document.querySelectorAll('*').forEach((el: any) => {
          const computed = window.getComputedStyle(el);
          if (computed.animationName !== 'none') {
            el.style.animationDelay = `-${time}ms`;
            el.style.animationPlayState = 'paused';
          }
        });
      }, timeMs);

      await wait(50);

      const screenshotBuffer = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width, height } });
      const img = await loadImage(Buffer.from(screenshotBuffer));
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      encoder.addFrame(ctx.getImageData(0, 0, width, height).data);

      if (i % 10 === 0) console.log(`📸 Frame ${i + 1}/${totalFrames}`);
    }

    encoder.finish();
    await browser.close();

    const gifBuffer = encoder.out.getData();
    console.log(`✅ GIF generado: ${(gifBuffer.length / 1024).toFixed(2)} KB`);

    return new Response(gifBuffer, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Content-Length': gifBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('❌ Error:', error);
    if (browser) await browser.close();

    // Return error SVG
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="100%" height="100%" fill="#333"/><text x="50%" y="50%" fill="red" text-anchor="middle">${msg}</text></svg>`, {
      status: 500,
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  return generateGif({
    html: searchParams.get('html') || '<div>Hello</div>',
    css: searchParams.get('css') || '',
    width: parseInt(searchParams.get('width') || '800'),
    height: parseInt(searchParams.get('height') || '400'),
    duration: parseInt(searchParams.get('duration') || '3'),
    fps: parseInt(searchParams.get('fps') || '30'),
    bg: searchParams.get('bg') || '#050505'
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return generateGif({
    html: body.html || '<div>Hello</div>',
    css: body.css || '',
    width: parseInt(body.width || '800'),
    height: parseInt(body.height || '400'),
    duration: parseInt(body.duration || '3'),
    fps: parseInt(body.fps || '30'),
    bg: body.bg || '#050505'
  });
}