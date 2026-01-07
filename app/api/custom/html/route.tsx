import { NextRequest, NextResponse } from 'next/server';

interface ParsedElement {
  tagName: string;
  attributes: Record<string, string>;
  content: string;
  children: ParsedElement[];
}

interface KeyframeRule {
  offset: string;
  properties: Map<string, string>;
}

interface ElementBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  // Border Box (Pre-padding/border)
  bx: number;
  by: number;
  bwidth: number;
  bheight: number;
  bcenterX: number;
  bcenterY: number;
}

class HtmlCssToSvgParser {
  private width: number;
  private height: number;
  private css: string;
  private idCounter: number = 0;
  private animationRules: Map<string, KeyframeRule[]> = new Map();
  private cssRules: Map<string, Map<string, string>> = new Map();
  private globalDefs: string[] = [];

  constructor(width: number, height: number, css: string) {
    this.width = width;
    this.height = height;
    this.css = css;
    this.parseAllCss();
  }

  parse(html: string): string {
    const elements = this.parseHtmlComplete(html);

    if (elements.length === 0) {
      return this.createEmptySvg();
    }

    return this.generateSvg(elements);
  }

  private parseHtmlComplete(html: string): ParsedElement[] {
    const elements: ParsedElement[] = [];
    html = html.trim();

    const elementRegex = /<(\w+)([^>]*)>([\s\S]*?)<\/\1>|<(\w+)([^>]*)\s*\/>/g;
    let match;

    while ((match = elementRegex.exec(html)) !== null) {
      if (match[1]) {
        const element = this.parseElementWithChildren(match[1], match[2], match[3]);
        if (element) {
          elements.push(element);
        }
      } else if (match[4]) {
        elements.push({
          tagName: match[4],
          attributes: this.parseAttributes(match[5]),
          content: '',
          children: []
        });
      }
    }

    return elements;
  }

  private parseElementWithChildren(
    tagName: string,
    attributeString: string,
    innerHtml: string
  ): ParsedElement | null {
    const attributes = this.parseAttributes(attributeString);

    let textContent = '';
    const children: ParsedElement[] = [];

    const childElementRegex = /<(\w+)([^>]*)>([\s\S]*?)<\/\1>|<(\w+)([^>]*)\s*\/>/g;
    let lastIndex = 0;
    let childMatch;

    while ((childMatch = childElementRegex.exec(innerHtml)) !== null) {
      if (childMatch.index > lastIndex) {
        const text = innerHtml.substring(lastIndex, childMatch.index).trim();
        if (text && !text.match(/^[\s]*$/)) {
          textContent += text + ' ';
        }
      }

      if (childMatch[1]) {
        const childElement = this.parseElementWithChildren(
          childMatch[1],
          childMatch[2],
          childMatch[3]
        );
        if (childElement) {
          children.push(childElement);
        }
      } else if (childMatch[4]) {
        children.push({
          tagName: childMatch[4],
          attributes: this.parseAttributes(childMatch[5]),
          content: '',
          children: []
        });
      }

      lastIndex = childMatch.index + childMatch[0].length;
    }

    if (lastIndex < innerHtml.length) {
      const text = innerHtml.substring(lastIndex).trim();
      if (text && !text.match(/^[\s]*$/)) {
        textContent += text;
      }
    }

    if (children.length === 0 && !textContent) {
      textContent = innerHtml.trim();
    }

    return {
      tagName,
      attributes,
      content: textContent.trim(),
      children
    };
  }

  private parseAttributes(attrString: string): Record<string, string> {
    const attrs: Record<string, string> = {};
    if (!attrString) return attrs;

    const attrRegex = /(\w+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let match;

    while ((match = attrRegex.exec(attrString)) !== null) {
      const name = match[1];
      const value = match[2] || match[3] || match[4] || '';
      attrs[name] = value;
    }

    return attrs;
  }

  private parseAllCss(): void {
    // Parser robusto con conteo de llaves
    let depth = 0;
    let buffer = '';
    let isComment = false;
    let i = 0;

    // Pre-procesar para eliminar comentarios de forma segura si es posible, 
    // pero el scanner lo puede manejar.
    // Vamos a recorrer caracter por caracter.

    const css = this.css;
    const len = css.length;

    while (i < len) {
      const char = css[i];
      const nextChar = css[i + 1];

      // Manejo de comentarios
      if (!isComment && char === '/' && nextChar === '*') {
        isComment = true;
        i += 2;
        continue;
      }
      if (isComment && char === '*' && nextChar === '/') {
        isComment = false;
        i += 2;
        continue;
      }
      if (isComment) {
        i++;
        continue;
      }

      // Manejo de bloques
      if (char === '{') {
        depth++;
        buffer += char;
      } else if (char === '}') {
        depth--;
        buffer += char;

        // Fin de un bloque raíz
        if (depth === 0) {
          this.processBlock(buffer.trim());
          buffer = '';
        }
      } else {
        // Solo agregar al buffer si estamos dentro de un bloque o acumulando para el inicio de uno
        // Si depth es 0, estamos capturando el selector o @rule
        // Si depth > 0, estamos capturando el contenido
        buffer += char;
      }

      i++;
    }

    // Procesa cualquier residuo si es necesario, aunque en CSS válido termina en }
  }

  private processBlock(block: string): void {
    // block es algo como "div { ... }" o "@keyframes name { ... }"

    // 1. Detectar si es @keyframes
    if (block.startsWith('@keyframes')) {
      const firstBrace = block.indexOf('{');
      const header = block.substring(0, firstBrace).trim(); // "@keyframes name"
      const content = block.substring(firstBrace + 1, block.length - 1).trim(); // "0% {...}"

      const parts = header.split(/\s+/);
      const name = parts[1]; // "name"

      if (name) {
        const rules = this.parseKeyframeRules(content);
        this.animationRules.set(name, rules);
      }
      return;
    }

    // 2. Es una regla de estilo normal
    const firstBrace = block.indexOf('{');
    if (firstBrace === -1) return;

    const selectorsStr = block.substring(0, firstBrace).trim();
    const content = block.substring(firstBrace + 1, block.length - 1).trim();

    const selectors = selectorsStr.split(',').map(s => s.trim());

    // Parsear declaraciones
    const styleMap = new Map<string, string>();
    content.split(';').forEach(decl => {
      const colonIndex = decl.indexOf(':');
      if (colonIndex > -1) {
        const property = decl.substring(0, colonIndex).trim();
        const value = decl.substring(colonIndex + 1).trim();
        if (property && value) {
          styleMap.set(property, value);
        }
      }
    });

    selectors.forEach(sel => {
      this.cssRules.set(sel, styleMap);
    });
  }

  private parseKeyframeRules(content: string): KeyframeRule[] {
    const rules: KeyframeRule[] = [];

    // Aquí el contenido es "0% { transform: ... } 100% { ... }"
    // Tambien necesitamos un mini-scanner para esto porque los regex fallan con llaves dentro de llaves (aunque raro en keyframes simple)
    // Pero usaremos Regex simplificado porque dentro de keyframe blocks no suele haber nesting profundo.

    const frameRegex = /((?:[\d.]+%|from|to)(?:\s*,\s*(?:[\d.]+%|from|to))*)\s*\{([^}]+)\}/g;
    let match;

    while ((match = frameRegex.exec(content)) !== null) {
      const offsets = match[1].split(',').map(o => o.trim());
      const properties = new Map<string, string>();

      match[2].split(';').forEach(decl => {
        const colonIndex = decl.indexOf(':');
        if (colonIndex > -1) {
          const property = decl.substring(0, colonIndex).trim();
          const value = decl.substring(colonIndex + 1).trim();
          if (property && value) {
            properties.set(property, value);
          }
        }
      });

      offsets.forEach(offset => {
        const normalizedOffset = offset === 'from' ? '0%' : offset === 'to' ? '100%' : offset;
        rules.push({
          offset: normalizedOffset,
          properties: new Map(properties)
        });
      });
    }

    // Ordenar por offset
    rules.sort((a, b) => {
      const aVal = parseFloat(a.offset) || 0;
      const bVal = parseFloat(b.offset) || 0;
      return aVal - bVal;
    });

    return rules;
  }

  private getElementStyles(element: ParsedElement, inherited?: Map<string, string>): Map<string, string> {
    const styles = new Map<string, string>();

    // Heredar propiedades del padre
    const inheritableProps = ['color', 'font-family', 'font-size', 'text-align', 'line-height'];
    if (inherited) {
      inheritableProps.forEach(prop => {
        const value = inherited.get(prop);
        if (value) {
          styles.set(prop, value);
        }
      });
    }

    // Aplicar estilos por tag
    const tagStyles = this.cssRules.get(element.tagName.toLowerCase());
    if (tagStyles) {
      tagStyles.forEach((value, key) => styles.set(key, value));
    }

    // Aplicar estilos por ID
    if (element.attributes.id) {
      const idStyles = this.cssRules.get(`#${element.attributes.id}`);
      if (idStyles) {
        idStyles.forEach((value, key) => styles.set(key, value));
      }
    }

    // Aplicar estilos por clase
    if (element.attributes.class) {
      const classes = element.attributes.class.split(/\s+/);
      classes.forEach(className => {
        const classStyles = this.cssRules.get(`.${className}`);
        if (classStyles) {
          classStyles.forEach((value, key) => styles.set(key, value));
        }
      });
    }

    // Aplicar estilos inline (máxima prioridad)
    if (element.attributes.style) {
      element.attributes.style.split(';').forEach(rule => {
        const colonIndex = rule.indexOf(':');
        if (colonIndex > -1) {
          const property = rule.substring(0, colonIndex).trim();
          const value = rule.substring(colonIndex + 1).trim();
          if (property && value) {
            styles.set(property, value);
          }
        }
      });
    }

    return styles;
  }

  private generateSvg(elements: ParsedElement[]): string {
    // 1. Defs iniciales
    this.createGlobalDefs();

    // 2. Renderizar contenido a un buffer (esto poblará globalDefs con gradientes)
    let contentBuffer = '';
    elements.forEach(element => {
      contentBuffer += this.renderElement(element, {
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
        centerX: this.width / 2,
        centerY: this.height / 2,
        bx: 0,
        by: 0,
        bwidth: this.width,
        bheight: this.height,
        bcenterX: this.width / 2,
        bcenterY: this.height / 2
      });
    });

    // 3. Construir SVG final
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">`;

    if (this.globalDefs.length > 0) {
      svg += '<defs>' + this.globalDefs.join('') + '</defs>';
    }

    svg += contentBuffer;
    svg += '</svg>';

    return svg;
  }

  private createGlobalDefs(): void {
    // Filtro para box-shadow
    this.globalDefs.push(`
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
        <feOffset dx="0" dy="4" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    `);
  }

  private renderElement(element: ParsedElement, bounds: ElementBounds): string {
    const styles = this.getElementStyles(element);
    const tagName = element.tagName.toLowerCase();

    // Calcular posición y dimensiones
    const layout = this.calculateElementLayout(element, styles, bounds);

    // Obtener animación si existe
    const animation = styles.get('animation');
    let hasAnimation = false;
    let animationElement = '';

    if (animation) {
      const animData = this.parseAnimation(animation);
      if (animData && this.animationRules.has(animData.name)) {
        hasAnimation = true;
        animationElement = this.createAnimationElement(
          animData.name,
          animData.duration,
          animData.iterationCount,
          this.animationRules.get(animData.name)!,
          layout
        );
      }
    }

    // Si tiene animación de transform, necesitamos centrar el elemento
    let result = '';
    const isFlex = styles.get('display') === 'flex';
    const flexDirection = styles.get('flex-direction') || 'row';
    const alignItems = styles.get('align-items') || 'stretch';
    const justifyContent = styles.get('justify-content') || 'flex-start';
    const gap = this.parseCssValue(styles.get('gap') || '0', 0);

    // Filtros (Sombras)
    const boxShadow = styles.get('box-shadow');
    const filterAttr = boxShadow && boxShadow !== 'none' ? 'filter="url(#shadow)"' : '';

    // Detectar si es una animación de transformación (scale, rotate) que requiere aislamiento de coordenadas
    const isTransformAnimation = hasAnimation && (animationElement.includes('type="scale"') || animationElement.includes('type="rotate"') || animationElement.includes('type="translate"'));

    if (isTransformAnimation) {
      // ESTRATEGIA DE AISLAMIENTO:
      // 1. Crear un grupo <g> posicionado en el CENTRO del elemento (translate(cx, cy)).
      // 2. Renderizar el contenido en (0,0) relativo a ese grupo.
      // 3. Aplicar la animación al contenido (que ahora está centrado).

      result = `<g transform="translate(${layout.bcenterX}, ${layout.bcenterY})" ${filterAttr}>`;

      // Construir contenido interno centrado
      let contentSvg = '';
      if (this.needsContainer(element, styles)) {
        let bg = this.renderContainerCentered(styles, layout);
        // Inyectar animación en rect
        if (animationElement && !element.content) {
          bg = bg.replace(' />', `>${animationElement}</rect>`);
        }
        contentSvg += bg;
      }

      if (element.content && !element.children.length) {
        let txt = this.renderTextCentered(element.content, styles, tagName);
        // Inyectar animación en text
        if (animationElement) {
          txt = txt.replace('</text>', `${animationElement}</text>`);
        }
        contentSvg += txt;
      }

      result += contentSvg + '</g>';
    } else {
      // Renderizado normal
      result = `<g ${filterAttr}>`;

      if (this.needsContainer(element, styles)) {
        result += this.renderContainer(layout, styles);
      }

      if (element.content && !element.children.length) {
        result += this.renderText(element.content, layout, styles, tagName);
      }

      // Renderizar hijos con Layout Engine
      if (element.children.length > 0) {
        let currentX = layout.x;
        let currentY = layout.y;

        // Pre-calcular alturas para flex align-items
        const childHeights = element.children.map(child => this.estimateElementHeight(child, this.getElementStyles(child)));
        const maxChildHeight = Math.max(...childHeights, 0);

        // Ajuste inicial para justify-content (muy básico)
        if (isFlex && flexDirection === 'row') {
          const totalChildrenWidth = element.children.reduce((acc, child) => acc + this.estimateElementWidth(child, this.getElementStyles(child)), 0);
          if (justifyContent === 'center') currentX = layout.centerX - (totalChildrenWidth / 2);
          if (justifyContent === 'flex-end') currentX = layout.x + layout.width - totalChildrenWidth;
          // Space between no implementado aun, se queda en start
        }

        // Block Flow (vertical centering basic)
        if (!isFlex && styles.get('text-align') === 'center') {
          // Si es bloque y tiene text-align center, intentamos centrar los hijos
          // Esto es asumiendo que los hijos son inline-block o similar, pero en este parser todo es block por defecto
          // No hacemos nada complejo aqui por ahora para no romper
        }

        element.children.forEach((child, index) => {
          const childStyles = this.getElementStyles(child);
          const childWidth = this.estimateElementWidth(child, childStyles);
          const childHeight = this.estimateElementHeight(child, childStyles);

          let childX = currentX;
          let childY = currentY;

          if (isFlex && flexDirection === 'row') {
            // Flex Row Logic
            if (alignItems === 'center') {
              childY = layout.y + (layout.height - childHeight) / 2; // Center in parent height
              // O usar maxChildHeight si quisiéramos alinear respecto a la linea
            }

            // Render
            result += this.renderElement(child, {
              ...layout,
              x: childX,
              y: childY,
              width: childWidth || layout.width, // Si no tiene width definido, usa width libre? No, mejor estimar
              height: childHeight
            });

            currentX += childWidth + gap;

          } else {
            // Block Flow Logic (Vertical Stack)
            // Si el hijo tiene position absolute, no afecta el flujo
            if (childStyles.get('position') === 'absolute') {
              result += this.renderElement(child, layout); // Usa layout padre, el hijo calculará su offset
            } else {
              result += this.renderElement(child, {
                ...layout,
                x: layout.x, // Hijos en bloque empiezan a la izq del padre (mas padding)
                y: currentY,
                height: childHeight
              });
              currentY += childHeight + gap;
            }
          }
        });
      }

      // Agregar animación si existe
      if (animationElement && !animationElement.includes('type="scale"')) {
        result = result.slice(0, -1) + '>' + animationElement + result.slice(-1);
      }

      result += '</g>';
    }

    return result;
  }

  // Helper para estimar tamaño (Layout Engine v1)
  private estimateElementHeight(element: ParsedElement, styles: Map<string, string>): number {
    const explicitHeight = styles.get('height');
    if (explicitHeight && explicitHeight !== 'auto') {
      return this.parseCssValue(explicitHeight, this.height);
    }

    const fontSize = this.getFontSize(styles, element.tagName);
    // Padding
    const paddingTop = this.parseCssValue(styles.get('padding-top') || '0', 0);
    const paddingBottom = this.parseCssValue(styles.get('padding-bottom') || '0', 0);
    const padding = styles.get('padding') ? this.parseCssValue(styles.get('padding')!.split(' ')[0], 0) * 2 : 0;

    let contentHeight = 0;
    if (element.content) {
      // Estimar líneas de texto
      const approxCharWidth = fontSize * 0.6;
      const containerWidth = this.width * 0.8; // Asumir 80% ancho si no se sabe
      const charsPerLine = Math.floor(containerWidth / approxCharWidth);
      const lines = Math.ceil(element.content.length / charsPerLine);
      contentHeight = lines * (fontSize * 1.4); // line-height
    }

    // Altura de hijos para contenedores
    if (element.children.length > 0) {
      const isFlex = styles.get('display') === 'flex';
      if (isFlex && styles.get('flex-direction') !== 'column') {
        // En row, es el maximo de los hijos
        contentHeight = Math.max(...element.children.map(c => this.estimateElementHeight(c, this.getElementStyles(c))));
      } else {
        // En stack, es la suma
        contentHeight = element.children.reduce((acc, c) => acc + this.estimateElementHeight(c, this.getElementStyles(c)), 0);
      }
    }

    // Min Height logic
    return Math.max(contentHeight + paddingTop + paddingBottom + padding, 20); // Min 20px
  }

  private estimateElementWidth(element: ParsedElement, styles: Map<string, string>): number {
    const explicitWidth = styles.get('width');
    if (explicitWidth && explicitWidth !== 'auto') {
      return this.parseCssValue(explicitWidth, this.width);
    }

    // Si es flex item y no tiene width, estimar por contenido
    if (element.content) {
      const fontSize = this.getFontSize(styles, element.tagName);
      return element.content.length * (fontSize * 0.6) + 20; // padding approx
    }

    return this.width; // Block default = 100% width (del contexto actual, que aqui es global width por simplificacion)

  }

  private calculateElementLayout(
    element: ParsedElement,
    styles: Map<string, string>,
    parentBounds: ElementBounds
  ): ElementBounds {
    // Initial Border Box calculations
    let bx = parentBounds.x;
    let by = parentBounds.y;
    let bwidth = parentBounds.width;
    let bheight = parentBounds.height;

    // Apply specific width/height first to determine Border Box
    const cssWidth = styles.get('width');
    if (cssWidth && cssWidth !== 'auto') {
      bwidth = this.parseCssValue(cssWidth, parentBounds.width);
    }

    const cssHeight = styles.get('height');
    if (cssHeight && cssHeight !== 'auto') {
      bheight = this.parseCssValue(cssHeight, parentBounds.height);
    }

    // Position Absolute logic for Border Box
    const position = styles.get('position');
    if (position === 'absolute') {
      const top = styles.get('top');
      const left = styles.get('left');

      if (left === '50%') {
        bx = parentBounds.centerX - bwidth / 2;
      } else if (left) {
        bx = this.parseCssValue(left, parentBounds.width);
      }

      if (top === '50%') {
        by = parentBounds.centerY - bheight / 2;
      } else if (top) {
        by = this.parseCssValue(top, parentBounds.height);
      }
    }

    // Content Box calculations (start from Border Box)
    let x = bx;
    let y = by;
    let width = bwidth;
    let height = bheight;

    // Apply padding to get Content Box
    const paddingTop = this.parseCssValue(styles.get('padding-top') || '0', bheight);
    const paddingLeft = this.parseCssValue(styles.get('padding-left') || '0', bwidth);
    const paddingRight = this.parseCssValue(styles.get('padding-right') || '0', bwidth);
    const paddingBottom = this.parseCssValue(styles.get('padding-bottom') || '0', bheight);

    const padding = styles.get('padding');
    if (padding) {
      const padValues = this.parsePadding(padding, { width: bwidth, height: bheight } as any);
      y += padValues.top;
      x += padValues.left;
      width -= padValues.left + padValues.right;
      height -= padValues.top + padValues.bottom;
    } else {
      y += paddingTop;
      x += paddingLeft;
      width -= paddingLeft + paddingRight;
      height -= paddingTop + paddingBottom;
    }

    // Ensure content box doesn't go negative
    width = Math.max(0, width);
    height = Math.max(0, height);

    return {
      x,
      y,
      width,
      height,
      centerX: x + width / 2,
      centerY: y + height / 2,
      bx,
      by,
      bwidth,
      bheight,
      bcenterX: bx + bwidth / 2,
      bcenterY: by + bheight / 2
    };
  }

  private parseAnimation(animation: string): {
    name: string;
    duration: string;
    timingFunction: string;
    delay: string;
    iterationCount: string;
    direction: string;
    fillMode: string;
  } | null {
    const parts = animation.trim().split(/\s+/);
    if (parts.length === 0) return null;

    let name = '';
    let duration = '0s';
    let timingFunction = 'ease';
    let delay = '0s';
    let iterationCount = '1';
    let direction = 'normal';
    let fillMode = 'none';

    let timeCount = 0;

    for (const part of parts) {
      // Time values (duration or delay)
      if (/^\d*\.?\d+(s|ms)$/.test(part)) {
        if (timeCount === 0) {
          duration = part;
          timeCount++;
        } else {
          delay = part;
        }
      }
      // Iteration count (infinite or number)
      else if (part === 'infinite' || /^\d+(\.\d+)?$/.test(part)) {
        iterationCount = part;
      }
      // Timing functions
      else if (['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end'].includes(part) || part.startsWith('cubic-bezier')) {
        timingFunction = part;
      }
      // Direction
      else if (['normal', 'reverse', 'alternate', 'alternate-reverse'].includes(part)) {
        direction = part;
      }
      // Fill mode
      else if (['none', 'forwards', 'backwards', 'both'].includes(part)) {
        fillMode = part;
      }
      // Assuming it's the name if nothing else matches (and loop hasn't found one yet)
      else if (!name) {
        name = part;
      }
    }

    return {
      name: name || parts[0], // Fallback if detection failed
      duration,
      timingFunction,
      delay,
      iterationCount,
      direction,
      fillMode
    };
  }

  private createAnimationElement(
    name: string,
    duration: string,
    iterationCount: string,
    keyframes: KeyframeRule[],
    layout: ElementBounds
  ): string {
    if (!keyframes || keyframes.length === 0) return '';

    // Detectar tipo de animación
    // Detect which properties are being animated
    const hasTranslate = keyframes.some(k => k.properties.get('transform')?.includes('translate'));
    const hasScale = keyframes.some(k => k.properties.get('transform')?.includes('scale'));
    const hasRotate = keyframes.some(k => k.properties.get('transform')?.includes('rotate'));
    const hasOpacity = keyframes.some(k => k.properties.get('opacity'));

    const translateValues: string[] = [];
    const scaleValues: string[] = [];
    const rotateValues: string[] = [];
    const opacityValues: string[] = [];
    const keyTimes: string[] = [];

    // Analyze keyframes
    for (const frame of keyframes) {
      const transform = frame.properties.get('transform') || '';
      const opacity = frame.properties.get('opacity');
      const offset = parseFloat(frame.offset) / 100;
      keyTimes.push(String(offset));

      if (hasTranslate) {
        // logic from before for composite translate
        let totalX = 0;
        let totalY = 0;
        const translateRegex = /translate(X|Y)?\(([^)]+)\)/g;
        let match;
        while ((match = translateRegex.exec(transform)) !== null) {
          const type = match[1] || '';
          const args = match[2].split(',').map(s => s.trim());
          const val1 = this.parseCssValue(args[0], type === 'Y' ? layout.height : layout.width);
          const val2 = args[1] ? this.parseCssValue(args[1], layout.height) : 0;

          if (type === 'X') totalX += val1;
          else if (type === 'Y') totalY += val1;
          else { totalX += val1; totalY += val2; }
        }
        translateValues.push(`${totalX} ${totalY}`);
      }

      if (hasScale) {
        const match = transform.match(/scale\(([\d.]+)(?:\s*,\s*([\d.]+))?\)/);
        if (match) {
          scaleValues.push(`${match[1]} ${match[2] || match[1]}`);
        } else {
          scaleValues.push('1 1');
        }
      }

      if (hasRotate) {
        const match = transform.match(/rotate\(([-\d.]+)deg?\)/);
        if (match) {
          rotateValues.push(`${match[1]} 0 0`);
        } else {
          rotateValues.push('0 0 0');
        }
      }

      if (hasOpacity) {
        opacityValues.push(opacity || '1');
      }
    }

    let svgAnims = '';
    // Default to linear for robustness. Spline requires precise control points matching keyTimes.
    // If user wants smooth, we can enhance later, but linear is safer for complex generated animations.
    const calcMode = 'linear';

    if (hasTranslate) {
      svgAnims += `<animateTransform attributeName="transform" type="translate" additive="sum" values="${translateValues.join(';')}" keyTimes="${keyTimes.join(';')}" dur="${duration}" repeatCount="${iterationCount === 'infinite' ? 'indefinite' : iterationCount}" calcMode="${calcMode}" />`;
    }
    if (hasScale) {
      svgAnims += `<animateTransform attributeName="transform" type="scale" additive="sum" values="${scaleValues.join(';')}" keyTimes="${keyTimes.join(';')}" dur="${duration}" repeatCount="${iterationCount === 'infinite' ? 'indefinite' : iterationCount}" calcMode="${calcMode}" />`;
    }
    if (hasRotate) {
      svgAnims += `<animateTransform attributeName="transform" type="rotate" additive="sum" values="${rotateValues.join(';')}" keyTimes="${keyTimes.join(';')}" dur="${duration}" repeatCount="${iterationCount === 'infinite' ? 'indefinite' : iterationCount}" calcMode="${calcMode}" />`;
    }
    if (hasOpacity) {
      svgAnims += `<animate attributeName="opacity" values="${opacityValues.join(';')}" keyTimes="${keyTimes.join(';')}" dur="${duration}" repeatCount="${iterationCount === 'infinite' ? 'indefinite' : iterationCount}" calcMode="${calcMode}" />`;
    }

    return svgAnims;

  }

  private generateKeySplines(keyframeCount: number): string {
    // Generar splines para una animación suave (ease-in-out)
    const splines: string[] = [];
    for (let i = 0; i < keyframeCount - 1; i++) {
      splines.push('0.42 0 0.58 1'); // Aproximación de ease-in-out
    }
    return splines.join(';');
  }

  private needsContainer(element: ParsedElement, styles: Map<string, string>): boolean {
    const background = styles.get('background') || styles.get('background-color');
    const border = styles.get('border');
    const boxShadow = styles.get('box-shadow');

    return !!(background || (border && border !== 'none') || (boxShadow && boxShadow !== 'none'));
  }

  private renderContainer(layout: ElementBounds, styles: Map<string, string>): string {
    const background = styles.get('background') || styles.get('background-color') || 'transparent';
    const border = styles.get('border');
    const borderRadius = this.parseCssValue(styles.get('border-radius') || '0', 0);

    let rect = `<rect x="${layout.x}" y="${layout.y}" width="${layout.width}" height="${layout.height}"`;
    let fill = background;

    // Gradient handling
    if (background.includes('gradient')) {
      const gradientId = `grad-${Math.random().toString(36).substr(2, 9)}`;
      const animation = styles.get('animation');
      const bgSize = styles.get('background-size');

      // Crear definición del gradiente
      const gradientDef = this.createLinearGradient(gradientId, background, bgSize, animation);
      this.globalDefs.push(gradientDef);
      fill = `url(#${gradientId})`;
    } else if (background.includes('rgba')) {
      const rgba = this.parseRgba(background);
      rect += ` fill="${rgba.color}" fill-opacity="${rgba.opacity}"`;
      fill = ''; // Already handled
    }

    if (fill) {
      rect += ` fill="${fill}"`;
    }

    if (border && border !== 'none') {
      const widthMatch = border.match(/^[\d.]+px/);
      const width = widthMatch ? widthMatch[0] : '1px';

      const colorMatch = border.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|[a-z]+/gi);
      // Filter out keywords that are not colors
      const color = colorMatch ? colorMatch.filter(c => !['solid', 'dashed', 'dotted', 'none', 'px'].some(x => c.includes(x))).pop() : '#000';

      if (color) {
        rect += ` stroke="${color}" stroke-width="${this.parseCssValue(width, 0)}"`;
      }
    }

    if (borderRadius > 0) {
      rect += ` rx="${borderRadius}" ry="${borderRadius}"`;
    }

    const boxShadow = styles.get('box-shadow');
    if (boxShadow && boxShadow !== 'none') {
      const shadowId = `shadow-${Math.random().toString(36).substr(2, 9)}`;
      const filterDef = this.createBoxShadowFilter(shadowId, boxShadow);
      this.globalDefs.push(filterDef);
      rect += ` filter="url(#${shadowId})"`;
    }

    // CSS FILTER SUPPORT (Blur)
    const cssFilter = styles.get('filter');
    if (cssFilter && cssFilter.includes('blur')) {
      const blurId = `blur-${Math.random().toString(36).substr(2, 9)}`;
      const filterDef = this.createBlurFilter(blurId, cssFilter);
      this.globalDefs.push(filterDef);
      rect += ` filter="url(#${blurId})"`;
    }

    rect += ' />';

    // DIFFERENTIAL BORDER SUPPORT (Spinners)
    // If it's a circle and has border-top defined separately
    const borderTop = styles.get('border-top');
    if (borderRadius >= layout.width / 2 && borderTop) {
      // Logic: Render an arc for the top border
      const topMatch = borderTop.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|[a-z]+/gi);
      const topColor = topMatch ? topMatch.filter(c => !['solid', 'dashed', 'dotted', 'none', 'px'].some(x => c.includes(x))).pop() : null;

      if (topColor) {
        const cx = layout.width / 2;
        const cy = layout.height / 2;
        const r = layout.width / 2; // Assuming circle
        const strokeWidthStr = borderTop.match(/^[\d.]+px/) || ['1px'];
        const strokeWidth = this.parseCssValue(strokeWidthStr[0], 0);

        // Path for Top Arc (Scanner: 12 o'clock centered, spans 90deg? usually border-top is 25%)
        // SVG Angles: 0 is Right (3 o'clock). -90 is Top (12 o'clock).
        // Span: -135deg to -45deg creates a top quarter sector.
        const startAngle = -135 * (Math.PI / 180);
        const endAngle = -45 * (Math.PI / 180);

        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);

        const d = `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;

        // Append path as a separate element (overlay)
        rect += `<path d="${d}" stroke="${topColor}" stroke-width="${strokeWidth}" fill="none" />`;
      }
    }

    return rect;
  }

  private renderContainerCentered(styles: Map<string, string>, layout: ElementBounds): string {
    // Reusing rendering logic but with centered coordinates
    // This is a bit lazy duplicating code, but ensures safety for now
    const background = styles.get('background') || styles.get('background-color') || 'transparent';
    const border = styles.get('border');
    const borderRadius = this.parseCssValue(styles.get('border-radius') || '0', 0);
    const boxShadow = styles.get('box-shadow');

    let rect = `<rect x="${-layout.width / 2}" y="${-layout.height / 2}" width="${layout.width}" height="${layout.height}"`;
    let fill = background;

    if (background.includes('gradient')) {
      const gradientId = `grad-${Math.random().toString(36).substr(2, 9)}`;
      const animation = styles.get('animation');
      const bgSize = styles.get('background-size');
      const gradientDef = this.createLinearGradient(gradientId, background, bgSize, animation);
      this.globalDefs.push(gradientDef);
      fill = `url(#${gradientId})`;
    } else if (background.includes('rgba')) {
      const rgba = this.parseRgba(background);
      rect += ` fill="${rgba.color}" fill-opacity="${rgba.opacity}"`;
      fill = '';
    }

    if (fill) rect += ` fill="${fill}"`;

    if (border && border !== 'none') {
      const widthMatch = border.match(/^[\d.]+px/);
      const width = widthMatch ? widthMatch[0] : '1px';

      const colorMatch = border.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|[a-z]+/gi);
      const color = colorMatch ? colorMatch.filter(c => !['solid', 'dashed', 'dotted', 'none', 'px'].some(x => c.includes(x))).pop() : '#000';

      if (color) {
        rect += ` stroke="${color}" stroke-width="${this.parseCssValue(width, 0)}"`;
      }
    }

    if (borderRadius > 0) {
      rect += ` rx="${borderRadius}" ry="${borderRadius}"`;
    }

    if (boxShadow && boxShadow !== 'none') {
      const shadowId = `shadow-${Math.random().toString(36).substr(2, 9)}`;
      const filterDef = this.createBoxShadowFilter(shadowId, boxShadow);
      this.globalDefs.push(filterDef);
      rect += ` filter="url(#${shadowId})"`;
    }

    rect += ' />';
    return rect;
  }

  private createLinearGradient(
    id: string,
    gradient: string,
    backgroundSize?: string,
    animation?: string
  ): string {
    // 1. Extract Angle
    const angleMatch = gradient.match(/(\d+)deg/);
    const angle = angleMatch ? parseInt(angleMatch[1]) : 45; // Default 45deg

    // Convert angle to coordinates
    // SVG gradients are normally left-to-right. 
    // We can use gradientTransform on the element, or x1/y1 attributes.
    // Simplifying for typical 45deg or 90deg usage:
    // This math estimates direction vector.
    const radians = (angle - 90) * Math.PI / 180;
    const x1 = 50 + Math.cos(radians) * 50;
    const y1 = 50 + Math.sin(radians) * 50;
    const x2 = 50 - Math.cos(radians) * 50;
    const y2 = 50 - Math.sin(radians) * 50;

    // 2. Extract Colors
    // Regex for hex, rgb, rgba, or word
    const colorRegex = /#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|[a-z]+/gi;
    const rawColors = gradient.match(colorRegex) || ['#000', '#fff'];
    const validColors = rawColors.filter(c => !['linear', 'gradient', 'deg', 'to', 'right', 'bottom'].includes(c));

    let def = `<linearGradient id="${id}"`;

    // Handle "Flow" layouts where background is huge (shimmer)
    if (backgroundSize && backgroundSize.includes('400%')) {
      // Shimmer case: User Space (Pixels)
      def += ` gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${this.width * 4}" y2="${this.height}"`;
    } else {
      // Standard case: Percentages based on Angle
      def += ` x1="${x1.toFixed(0)}%" y1="${y1.toFixed(0)}%" x2="${x2.toFixed(0)}%" y2="${y2.toFixed(0)}%"`;
    }

    def += '>';

    validColors.forEach((color, index) => {
      const offset = (index / (validColors.length - 1)) * 100;
      def += `<stop offset="${offset}%" stop-color="${color}" />`;
    });

    // 3. Inject Animation (The "Smart Mapper" Logic)
    if (animation) {
      const parts = animation.split(' ');
      const animName = parts[0];
      const duration = parts.find(p => p.match(/^\d+s|ms$/)) || '2s';

      if (this.animationRules.has(animName)) {
        const keyframes = this.animationRules.get(animName)!;
        // Scan for background-position
        const bgPosFrames = keyframes.filter(k => k.properties.has('background-position'));

        if (bgPosFrames.length > 0) {
          // Calcular ancho total del background
          let bgWidth = this.width;
          if (backgroundSize && backgroundSize.includes('%')) {
            const percent = parseInt(backgroundSize) / 100;
            bgWidth = this.width * percent;
          }

          // Contenedor visible vs Background total
          // Range: 0% position = 0px
          // 100% position = -(bgWidth - this.width) px (Standard CSS behavior for bg-position with larger image)
          const maxOffset = -(bgWidth - this.width);

          const values: string[] = [];
          const keyTimes: string[] = [];

          bgPosFrames.forEach(frame => {
            const pos = frame.properties.get('background-position')!;
            // Extraer componente X (asumiendo "X% Y%" o solo "X%")
            const parts = pos.trim().split(/\s+/);
            let xPercent = 0;
            if (parts[0].includes('%')) {
              xPercent = parseFloat(parts[0]);
            }

            // Map 0-100% css pos to translation
            const translateX = (xPercent / 100) * maxOffset;
            values.push(translateX.toFixed(2));

            // KeyTime (0-1)
            const time = parseFloat(frame.offset) / 100;
            keyTimes.push(time.toString());
          });

          // VALIDATION: Ensure keyTimes start at 0 and end at 1 for valid loop
          if (keyTimes.length > 0) {
            if (keyTimes[0] !== '0') {
              keyTimes.unshift('0');
              values.unshift(values[0]);
            }
            if (keyTimes[keyTimes.length - 1] !== '1') {
              keyTimes.push('1');
              values.push(values[values.length - 1]);
            }
          }

          // Si solo hay un frame (to/from implícito), esto podría fallar, pero asumiendo keyframes completos 0-100
          if (values.length > 1) {
            console.log('Generating dynamic gradient animation:', animName, values, keyTimes);
            def += `
                 <animateTransform 
                   attributeName="gradientTransform" 
                   type="translate" 
                   values="${values.join(';')}" 
                   keyTimes="${keyTimes.join(';')}"
                   dur="${duration}" 
                   repeatCount="indefinite" 
                   calcMode="linear"
                 />`;
          }
        }
      }
    }

    def += '</linearGradient>';
    return def;
  }

  private createBoxShadowFilter(id: string, shadow: string): string {
    // Parse CSS box-shadow: e.g. "0 8px 32px rgba(0, 0, 0, 0.3)"
    // 1. Extract Color
    const colorMatch = shadow.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|[a-z]+/i);
    const color = colorMatch ? colorMatch[0] : '#000';

    // 2. Extract Numbers (dx, dy, blur, spread)
    // Remove color to just get numbers
    const params = shadow.replace(color, '').trim().split(/\s+/);
    const dx = parseFloat(params[0] || '0');
    const dy = parseFloat(params[1] || '0');
    const blur = parseFloat(params[2] || '0');
    // We ignore spread for SVG simplicity (requires morphine/dilation)

    // SVG stdDeviation is approx blur / 2
    const stdDeviation = blur / 2;

    return `
      <filter id="${id}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${stdDeviation}"/>
        <feOffset dx="${dx}" dy="${dy}" result="offsetblur"/>
        <feFlood flood-color="${color}" result="color"/>
        <feComposite in2="offsetblur" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    `;
  }

  private createBlurFilter(id: string, blurValue: string): string {
    const blurMatch = blurValue.match(/(\d+)px/);
    const blurPixels = blurMatch ? parseFloat(blurMatch[1]) : 0;

    // For direct element blur, stdDeviation roughly equals pixel radius
    // Increase filter region to avoid clipping
    return `
      <filter id="${id}" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${blurPixels}" />
      </filter>
    `;
  }

  private renderText(
    text: string,
    layout: ElementBounds,
    styles: Map<string, string>,
    tagName: string
  ): string {
    if (!text) return '';

    const fontSize = this.getFontSize(styles, tagName);
    const fontFamily = styles.get('font-family')?.replace(/['"]/g, '') || 'Arial, sans-serif';
    const fontWeight = styles.get('font-weight') || this.getDefaultFontWeight(tagName);
    const color = styles.get('color') || '#ffffff'; // Default white for dark mode if not set
    const textAlign = styles.get('text-align') || 'left';

    // Text Wrapping Logic
    const approxCharWidth = fontSize * 0.6;
    const maxWidth = layout.width;
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      if ((currentLine.length + 1 + words[i].length) * approxCharWidth < maxWidth) {
        currentLine += ' ' + words[i];
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);

    let x = layout.x;
    let textAnchor = 'start';

    if (textAlign === 'center') {
      x = layout.centerX;
      textAnchor = 'middle';
    } else if (textAlign === 'right') {
      x = layout.x + layout.width;
      textAnchor = 'end';
    }

    // Start Y: if multiple lines, start slightly higher? Or just accumulate dy?
    const lineHeight = fontSize * 1.2;
    const y = layout.y + fontSize;

    const tspans = lines.map((line, index) => {
      const dy = index === 0 ? 0 : lineHeight;
      return `<tspan x="${x}" dy="${dy}">${this.escapeXml(line)}</tspan>`;
    }).join('');

    // Text Shadow
    let filterAttr = '';
    const textShadow = styles.get('text-shadow');
    if (textShadow && textShadow !== 'none') {
      const shadowId = `text-shadow-${Math.random().toString(36).substr(2, 9)}`;
      const filterDef = this.createBoxShadowFilter(shadowId, textShadow);
      this.globalDefs.push(filterDef);
      filterAttr = `filter="url(#${shadowId})"`;
    }

    return `
      <text x="${x}" y="${y}"
            font-family="${fontFamily}"
            font-size="${fontSize}"
            font-weight="${fontWeight}"
            fill="${color}"
            text-anchor="${textAnchor}"
            ${filterAttr}>
        ${tspans}
      </text>
    `;
  }

  private renderTextCentered(
    text: string,
    styles: Map<string, string>,
    tagName: string
  ): string {
    if (!text) return '';

    const fontSize = this.getFontSize(styles, tagName);
    const fontFamily = styles.get('font-family')?.replace(/['"]/g, '') || 'Arial, sans-serif';
    const fontWeight = styles.get('font-weight') || this.getDefaultFontWeight(tagName);
    const color = styles.get('color') || '#000000';

    // Text Shadow
    let filterAttr = '';
    const textShadow = styles.get('text-shadow');
    if (textShadow && textShadow !== 'none') {
      const shadowId = `text-shadow-${Math.random().toString(36).substr(2, 9)}`;
      const filterDef = this.createBoxShadowFilter(shadowId, textShadow);
      this.globalDefs.push(filterDef);
      filterAttr = `filter="url(#${shadowId})"`;
    }

    // Texto centrado en 0,0
    return `
      <text x="0" y="0"
            font-family="${fontFamily}"
            font-size="${fontSize}"
            font-weight="${fontWeight}"
            fill="${color}"
            text-anchor="middle"
            dominant-baseline="middle"
            ${filterAttr}>
        ${this.escapeXml(text)}
      </text>
    `;
  }

  private parsePadding(padding: string, bounds: ElementBounds): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } {
    const values = padding.split(/\s+/).map(v => this.parseCssValue(v, bounds.height));

    if (values.length === 1) {
      return { top: values[0], right: values[0], bottom: values[0], left: values[0] };
    } else if (values.length === 2) {
      return { top: values[0], right: values[1], bottom: values[0], left: values[1] };
    } else if (values.length === 3) {
      return { top: values[0], right: values[1], bottom: values[2], left: values[1] };
    } else {
      return { top: values[0], right: values[1], bottom: values[2], left: values[3] };
    }
  }

  private parseCssValue(value: string, parentValue: number): number {
    if (!value) return 0;

    if (value.includes('%')) {
      return (parseFloat(value) / 100) * parentValue;
    }

    if (value.includes('px')) {
      return parseFloat(value);
    }

    if (value.includes('em')) {
      return parseFloat(value) * 16;
    }

    if (value.includes('rem')) {
      return parseFloat(value) * 16;
    }

    return parseFloat(value) || 0;
  }

  private parseRgba(rgba: string): { color: string; opacity: string } {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (match) {
      const [, r, g, b, a] = match;
      const hex = '#' + [r, g, b].map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');

      return { color: hex, opacity: a || '1' };
    }

    return { color: '#000000', opacity: '1' };
  }

  private getFontSize(styles: Map<string, string>, tagName: string): number {
    const fontSize = styles.get('font-size');
    if (fontSize) {
      return this.parseCssValue(fontSize, 16);
    }

    const defaultSizes: Record<string, number> = {
      h1: 36, h2: 32, h3: 28, h4: 24, h5: 20, h6: 18,
      p: 16, span: 16, div: 16, a: 16, li: 16,
      small: 12, code: 14
    };

    return defaultSizes[tagName] || 16;
  }

  private getDefaultFontWeight(tagName: string): string {
    return tagName.startsWith('h') ? 'bold' : 'normal';
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private createEmptySvg(): string {
    return `< svg xmlns = "http://www.w3.org/2000/svg" width = "${this.width}" height = "${this.height}" viewBox = "0 0 ${this.width} ${this.height}" >
      <rect width="${this.width}" height="${this.height}" fill="#f0f0f0"/>
      <text x="${this.width / 2}" y="${this.height / 2}" text-anchor="middle" fill="#999">Empty</text>
    </svg > `;
  }
}

// Route handlers permanecen iguales
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const htmlInput = searchParams.get('html') || '<div>Hello World</div>';
    const cssInput = searchParams.get('css') || '';
    const width = parseInt(searchParams.get('width') || '800');
    const height = parseInt(searchParams.get('height') || '400');

    const parser = new HtmlCssToSvgParser(width, height, cssInput);
    const svgOutput = parser.parse(htmlInput);

    return new NextResponse(svgOutput, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    const errorSvg = `< svg xmlns = "http://www.w3.org/2000/svg" width = "400" height = "200" > <text x="200" y="100" text-anchor="middle">Error</text></svg > `;
    return new NextResponse(errorSvg, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { html, css, width = 800, height = 400 } = body;

    const parser = new HtmlCssToSvgParser(width, height, css || '');
    const svgOutput = parser.parse(html || '<div>Hello World</div>');

    return NextResponse.json({ svg: svgOutput, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to parse', success: false }, { status: 500 });
  }
}