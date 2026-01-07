import { NextRequest, NextResponse } from 'next/server';

export interface GifRequestBody {
    html: string;
    css: string;
    width?: number;
    height?: number;
    duration?: number;
}

export async function POST(req: NextRequest) {
    try {
        // 1. Tipamos el body al leerlo
        const body = (await req.json()) as GifRequestBody;
        const { html, css, width, height, duration } = body;

        // Validación básica
        if (!html || !css) {
            return NextResponse.json(
                { error: 'HTML y CSS son obligatorios' },
                { status: 400 }
            );
        }

        const RAILWAY_URL = process.env.RAILWAY_WORKER_URL;
        console.log("🚀 ~ POST ~ RAILWAY_URL:", RAILWAY_URL)

        if (!RAILWAY_URL) {
            console.error('Falta la variable de entorno RAILWAY_WORKER_URL');
            return NextResponse.json({ error: 'Configuración del servidor incompleta' }, { status: 500 });
        }

        // 2. Llamada al Worker en Railway
        const workerResponse = await fetch(RAILWAY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                html,
                css,
                width: width ?? 800,      // Valores por defecto
                height: height ?? 400,
                duration: duration ?? 3
            }),
        });

        if (!workerResponse.ok) {
            const errorText = await workerResponse.text();
            console.error('Railway Error:', errorText);
            return NextResponse.json(
                { error: 'Error al generar el GIF en el worker remoto' },
                { status: 502 }
            );
        }

        // 3. Recibir el Buffer
        const imageBuffer = await workerResponse.arrayBuffer();

        // 4. Devolver la respuesta binaria con las cabeceras correctas
        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/gif',
                'Content-Disposition': 'attachment; filename="banner.gif"',
            },
        });

    } catch (error) {
        console.error('API Proxy Error:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}