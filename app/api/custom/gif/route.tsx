import { NextRequest } from 'next/server';
import puppeteer, { Browser, Page } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
// @ts-ignore
import GIFEncoder from 'gif-encoder-2';
import { createCanvas, loadImage } from 'canvas';

// Configuración para Next.js 15
export const runtime = 'nodejs';
export const maxDuration = 30;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(request: NextRequest) {
    let browser: Browser | null = null;

    try {
        const searchParams = request.nextUrl.searchParams;

        const html = searchParams.get('html') || '<div style="color: white; font-size: 48px; text-align: center; padding-top: 150px;">Hello World</div>';
        const css = searchParams.get('css') || '';
        const width = parseInt(searchParams.get('width') || '800');
        const height = parseInt(searchParams.get('height') || '400');
        const duration = parseInt(searchParams.get('duration') || '3');
        const fps = parseInt(searchParams.get('fps') || '24');
        const bg = searchParams.get('bg') || '#050505';

        const totalFrames = duration * fps;

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
    
    ${css}
  </style>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
  ${html}
</body>
</html>
    `;

        const isProduction = process.env.NODE_ENV === 'production';

        // Determinar executablePath
        let executablePath: string;

        if (isProduction) {
            executablePath = await chromium.executablePath();
        } else {
            // Para desarrollo local
            executablePath = process.env.PUPPETEER_EXECUTABLE_PATH ||
                process.env.CHROME_PATH ||
                // Intentar rutas comunes según el OS
                (process.platform === 'win32'
                    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
                    : process.platform === 'darwin'
                        ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
                        : '/usr/bin/google-chrome');
        }

        console.log(`Usando Chrome en: ${executablePath}`);

        browser = await puppeteer.launch({
            args: isProduction ? chromium.args : [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
            ],
            defaultViewport: {
                width,
                height,
            },
            executablePath,
            headless: true,
        });

        const page: Page = await browser.newPage();
        await page.setViewport({ width, height });
        await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

        await wait(100);

        const encoder = new GIFEncoder(width, height);

        encoder.setDelay(1000 / fps);
        encoder.setRepeat(0);
        encoder.setQuality(10);

        encoder.start();

        console.log(`Generando GIF: ${totalFrames} frames @ ${fps}fps`);

        for (let i = 0; i < totalFrames; i++) {
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
                console.log(`Frame ${i + 1}/${totalFrames}`);
            }

            await wait(1000 / fps);
        }

        encoder.finish();
        await browser.close();

        const gifBuffer = encoder.out.getData();

        console.log(`GIF generado: ${gifBuffer.length} bytes`);

        return new Response(gifBuffer, {
            headers: {
                'Content-Type': 'image/gif',
                'Cache-Control': 'public, max-age=86400',
                'Content-Length': gifBuffer.length.toString(),
            },
        });

    } catch (error) {
        console.error('Error generating GIF:', error);

        if (browser) {
            await browser.close();
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error && error.stack ? error.stack : '';

        const errorSvg = `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="400" fill="#1a1a1a"/>
  <text x="400" y="160" text-anchor="middle" fill="#ff4444" font-size="24" font-weight="bold">
    Error generating GIF
  </text>
  <text x="400" y="200" text-anchor="middle" fill="#ffffff" font-size="14">
    ${errorMessage.substring(0, 80)}
  </text>
  <text x="400" y="230" text-anchor="middle" fill="#888888" font-size="12">
    ${errorMessage.includes('executablePath') ? 'Chrome/Chromium not found' : 'Check server logs'}
  </text>
  <text x="400" y="260" text-anchor="middle" fill="#666666" font-size="10">
    ${errorMessage.includes('executablePath') ? 'Set CHROME_PATH in .env.local' : ''}
  </text>
</svg>`;

        return new Response(errorSvg, {
            status: 500,
            headers: { 'Content-Type': 'image/svg+xml' },
        });
    }
}