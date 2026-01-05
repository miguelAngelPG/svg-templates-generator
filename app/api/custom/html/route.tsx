import { NextRequest } from 'next/server';

// Convertir HTML simple a elementos SVG nativos
function htmlToSvgElements(html: string, css: string): string {
    // Esta es una versión SIMPLIFICADA
    // Para producción necesitarías un parser completo

    let svgContent = '';
    let yPosition = 50;

    // Detectar divs con texto
    const divRegex = /<div[^>]*>(.*?)<\/div>/g;
    const matches = html.matchAll(divRegex);

    for (const match of matches) {
        const content = match[1].replace(/<[^>]*>/g, ''); // Remove inner tags

        svgContent += `
    <text x="50" y="${yPosition}" fill="#ffffff" font-size="24">
      ${content}
    </text>`;

        yPosition += 40;
    }

    return svgContent;
}

// Extraer keyframes del CSS
function extractKeyframes(css: string): string {
    const keyframesRegex = /@keyframes\s+(\w+)\s*{([^}]+)}/g;
    let svgAnimations = '';

    const matches = css.matchAll(keyframesRegex);

    for (const match of matches) {
        const animationName = match[1];
        const keyframesContent = match[2];

        // Convertir keyframes CSS a SVG animate
        // Esto es una simplificación - necesitarías un parser completo
        svgAnimations += `
    <!-- Animation: ${animationName} -->
    <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />`;
    }

    return svgAnimations;
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        const html = searchParams.get('html') || '<div>Hello World</div>';
        const css = searchParams.get('css') || '';
        const width = parseInt(searchParams.get('width') || '800');
        const height = parseInt(searchParams.get('height') || '400');
        const bg = searchParams.get('bg') || '#050505';

        // Convertir HTML a SVG
        const svgElements = htmlToSvgElements(html, css);

        // Extraer animaciones
        const animations = extractKeyframes(css);

        // SVG Nativo puro (funciona en GitHub)
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      /* CSS que SÍ funciona en SVG */
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&amp;display=swap');
      
      .text-animated {
        animation: fadeIn 2s infinite;
      }
      
      @keyframes fadeIn {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
      
      ${css}
    </style>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${bg}"/>
  
  <!-- Contenido convertido de HTML -->
  <g class="content">
    ${svgElements}
  </g>
  
  ${animations}
</svg>`;

        return new Response(svg, {
            headers: {
                'Content-Type': 'image/svg+xml; charset=utf-8',
                'Cache-Control': 'public, max-age=3600',
            },
        });

    } catch (error) {
        console.error('Error:', error);

        const errorSvg = `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="400" fill="#1a1a1a"/>
  <text x="400" y="200" text-anchor="middle" fill="#ff4444" font-size="20">
    Error generating SVG
  </text>
</svg>`;

        return new Response(errorSvg, {
            headers: { 'Content-Type': 'image/svg+xml' },
        });
    }
}