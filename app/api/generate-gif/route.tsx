import { NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import puppeteer, { Browser } from 'puppeteer-core';
// @ts-ignore
import GIFEncoder from 'gif-encoder-2';
import { createCanvas, loadImage } from 'canvas';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
        executablePath: process.env.CHROME_PATH ||
            (process.platform === 'win32'
                ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
                : process.platform === 'darwin'
                    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
                    : '/usr/bin/google-chrome'),
    };
}

async function generateGIF(html: string, css: string, width: number, height: number, duration: number, fps: number, bg: string): Promise<Buffer> {
    let browser: Browser | null = null;

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
<body>${html}</body>
</html>`;

        console.log('🎬 Lanzando navegador...');
        const chromiumConfig = await getChromium();

        browser = await puppeteer.launch({
            args: chromiumConfig.args,
            defaultViewport: { width, height },
            executablePath: chromiumConfig.executablePath,
            headless: true,
        });

        const page = await browser.newPage();
        await page.setViewport({ width, height });
        await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
        await wait(1000);

        console.log('⏸️  Pausando animaciones...');
        await page.evaluate(() => {
            const style = document.createElement('style');
            style.innerHTML = `* { animation-play-state: paused !important; }`;
            document.head.appendChild(style);
            document.querySelectorAll('*').forEach((el: any) => {
                const computed = window.getComputedStyle(el);
                if (computed.animationName !== 'none') {
                    el.style.animationPlayState = 'paused';
                }
            });
        });

        console.log(`📸 Capturando ${totalFrames} frames...`);
        const encoder = new GIFEncoder(width, height);
        encoder.setDelay(1000 / fps);
        encoder.setRepeat(0);
        encoder.setQuality(10);
        encoder.start();

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
                console.log(`  Frame ${i + 1}/${totalFrames}`);
            }
        }

        encoder.finish();
        await browser.close();

        return encoder.out.getData();

    } catch (error) {
        if (browser) await browser.close();
        throw error;
    }
}

// Función helper para subir a Cloudinary
async function uploadToCloudinary(buffer: Buffer, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image',
                format: 'gif',
                public_id: `gifs/${filename}`,
                folder: 'svg-generator',
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve(result.secure_url);
                } else {
                    reject(new Error('Upload failed'));
                }
            }
        );

        uploadStream.end(buffer);
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            html = '<div style="color: white; font-size: 48px; text-align: center; padding-top: 150px;">Hello World</div>',
            css = '',
            width = 800,
            height = 400,
            duration = 3,
            fps = 30,
            bg = '#050505',
        } = body;

        console.log('🚀 Iniciando generación de GIF...');

        // 1. Generar GIF
        const gifBuffer = await generateGIF(html, css, width, height, duration, fps, bg);
        const sizeKB = (gifBuffer.length / 1024).toFixed(2);
        console.log(`✅ GIF generado: ${sizeKB} KB`);

        // 2. Generar nombre único
        const hash = crypto.createHash('md5').update(html + css).digest('hex').substring(0, 8);
        const filename = `gif-${hash}-${Date.now()}`;

        console.log(`📤 Subiendo a Cloudinary: ${filename}`);

        // 3. Subir a Cloudinary
        const url = await uploadToCloudinary(gifBuffer, filename);

        console.log(`✨ URL permanente: ${url}`);

        return Response.json({
            success: true,
            url,
            size: gifBuffer.length,
            sizeKB,
            filename,
            markdown: `![Animated](${url})`,
            html: `<img src="${url}" alt="Animated GIF" />`,
        });

    } catch (error) {
        console.error('❌ Error:', error);

        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}