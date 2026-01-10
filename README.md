# 🎨 SVG Templates Generator - Templates Chonchos

Generador de templates SVG ultra avanzados con animaciones, glassmorphism, y efectos de profundidad para GitHub profiles.

## 📦 Templates Disponibles

### 1. Hero Template (Ultra Chocho 🔥)
Profile header con blobs morfing, partículas flotantes y glassmorphism multicapa.

**Ubicación:** `app/api/templates/hero/route.ts`

**Uso:**
```markdown
![Hero](https://tu-dominio.vercel.app/api/templates/hero?name=Miguel&title=Tech%20Lead)
```

**Parámetros:**
- `name` - Tu nombre (default: "Miguel A. Pacheco")
- `title` - Tu título/rol (default: "Tech Lead & Architect")
- `subtitle` - Subtítulo (default: "Human first, Engineer second")
- `location` - Tu ubicación (default: "Hidalgo, MX")
- `lang` - Idioma: `es` | `en` (default: "es")
- `theme` - Tema: `purple-cyan` | `orange-pink` | `green-blue` (default: "purple-cyan")
- `speed` - Velocidad animación: `slow` | `normal` | `fast` (default: "normal")
- `glass` - Intensidad vidrio: `low` | `medium` | `high` (default: "medium")

**Efectos incluidos:**
- ✨ Blobs con morphing animation
- 🌊 Partículas flotantes
- 💎 Glassmorphism multicapa
- ⚡ Gradientes animados
- 🎨 Glow effects
- 📍 Location badge con glass effect

---

### 2. Impact Card Template
Card de experiencia laboral con stats animados, tech stack y glow effects.

**Ubicación:** `app/api/templates/impact/route.ts`

**Uso:**
```markdown
![Impact](https://tu-dominio.vercel.app/api/templates/impact?company=Salinas&stat=40%)
```

**Parámetros:**
- `company` - Nombre de la empresa (default: "Grupo Salinas")
- `role` - Tu rol (default: "Tech Lead")
- `year` - Período (default: "2024 - Present")
- `stat` - Estadística principal (default: "+40%")
- `desc` - Descripción del stat (default: "System Performance")
- `description` - Descripción del trabajo (max ~100 chars)
- `tech` - Tech stack (separado por comas, max 4) (default: "React,TypeScript,Jest")
- `logo` - Emoji/ícono de la empresa (default: "🏦")
- `theme` - Tema: `cyan` | `purple` | `orange` | `green` (default: "cyan")

**Efectos incluidos:**
- 📊 Stats con efecto stroke + fill
- ✨ Multi-layer shadow con color
- 🏷️ Tags animados con fade-in
- 💫 Glow pulse en elementos
- 🎯 Bordes con gradiente animado

---

### 3. Philosophy Banner Template
Banner de filosofía/quote personal con warmth effect.

**Ubicación:** `app/api/templates/philosophy/route.ts`

**Uso:**
```markdown
![Philosophy](https://tu-dominio.vercel.app/api/templates/philosophy?quote=Your%20quote%20here)
```

**Parámetros:**
- `title` - Título de la sección (default: "The Person Behind the Code")
- `quote` - Tu quote personal (default: "Technology is the tool, empathy is the engine.")
- `icon` - Emoji/ícono (default: "⚛")
- `lang` - Idioma: `es` | `en` (default: "en")
- `theme` - Tema: `cyan` | `purple` | `orange-pink` | etc. (default: "orange-pink")
- `customColor` - Color Hex personalizado (opcional)

**Efectos incluidos:**
- 🔥 Warm gradient overlay
- 💭 Quote box con border animado
- ✨ Icon pulse animation
- 🌟 Decorative elements con fade

---

### 4. Tech Stack Grid Template
Grid visual de tu stack tecnológico con iconos y efectos.

**Ubicación:** `app/api/templates/stack/route.ts`

**Uso:**
```markdown
![Stack](https://tu-dominio.vercel.app/api/templates/stack?items=Frontend,Backend,DevOps)
```

**Parámetros:**
- `items` - Categorías (separadas por comas) (default: "Frontend,Backend,Architecture,DevOps")
- `details` - Detalles de cada categoría (separados por `|` dentro de cada item, items separados por `,`) (default: "React|Next.js|Tailwind,.NET|Java|Node.js,...")
- `icons` - Emojis para cada item (separados por comas) (default: "⚛️,⚙️,🏗️,🐳")
- `theme` - Tema: `cyan` | `purple` | `orange` | `green` (default: "cyan")

**Efectos incluidos:**
- 🎯 Icon rotation subtle animation
- 💫 Glow pulse en iconos
- 📦 Glass containers
- ✨ Fade-in secuencial

---

## 🚀 Instalación

### 1. Copia los archivos a tu proyecto:

```bash
svg-templates-generator/
└── app/
    └── api/
        └── templates/
            ├── hero/route.ts
            ├── impact/route.ts
            ├── philosophy/route.ts
            └── stack/route.ts
```

### 2. Instala dependencias:

```bash
cd svg-templates-generator
npm install
```

### 3. Corre el proyecto:

```bash
npm run dev
```

### 4. Prueba localmente:

```
http://localhost:3000/api/templates/hero?name=Miguel
http://localhost:3000/api/templates/impact?company=Salinas
http://localhost:3000/api/templates/philosophy?quote=Test
http://localhost:3000/api/templates/stack
```

---

## 🌐 Deploy a Vercel

```bash
npm install -g vercel
vercel
```

Una vez deployado, usa en tu README:

```markdown
![Hero](https://tu-dominio.vercel.app/api/templates/hero?name=Tu%20Nombre)
```

---

## 💡 Ejemplo Completo de GitHub README

```markdown
# Tu Nombre

![Hero](https://domain.vercel.app/api/templates/hero?name=Miguel%20Pacheco&title=Tech%20Lead&theme=purple-cyan&speed=normal)

![Philosophy](https://domain.vercel.app/api/templates/philosophy?quote=Technology%20is%20the%20tool,%20empathy%20is%20the%20engine)

## Work Experience

<div align="center">

![Salinas](https://domain.vercel.app/api/templates/impact?company=Grupo%20Salinas&role=Tech%20Lead&stat=40%25&desc=Performance&theme=cyan)
![SEMAR](https://domain.vercel.app/api/templates/impact?company=SEMAR&role=Architect&stat=30%25&desc=Efficiency&theme=green)

</div>

## Tech Stack

![Stack](https://domain.vercel.app/api/templates/stack?items=Frontend,Backend,Architecture,DevOps&theme=cyan)
```

---

## 🎨 Personalización

### Temas Disponibles

**Hero:**
- `purple-cyan` - Morado y cyan (tech vibe)
- `orange-pink` - Naranja a rosa (warm, creative)
- `green-blue` - Verde a azul (fresh, modern)

**Impact & Stack:**
- `cyan` - Cyan (tech/corporate)
- `purple` - Morado (creative)
- `orange` - Naranja (energético)
- `green` - Verde (growth)

### Velocidades de Animación

- `slow` - Animaciones lentas y relajadas
- `normal` - Velocidad balanceada (default)
- `fast` - Animaciones rápidas y dinámicas

### Intensidad de Glassmorphism

- `low` - Efecto sutil
- `medium` - Balanceado (default)
- `high` - Efecto muy pronunciado

---

## 🔧 Troubleshooting

### Las animaciones no se ven en GitHub
- ✅ GitHub soporta animaciones SVG nativas
- ❌ Si no se ven, verifica que el SVG no esté corrupto
- ❌ Revisa que no haya caracteres especiales sin encodear

### URL muy larga
- Usa un acortador de URLs
- O crea aliases en tu vercel.json

### Caracteres especiales
Recuerda encodear:
- Espacios: `%20`
- `&`: `%26`
- `+`: `%2B`
- `,`: `%2C`

---

## 📝 Roadmap

- [ ] Más temas de color
- [ ] Template de skills con progress bars
- [ ] Template de GitHub stats personalizado
- [ ] Template de contact con QR codes
- [ ] Builder visual (UI para generar sin código)

---

## 🤝 Contribuciones

PRs bienvenidos! Abre un issue primero para discutir cambios.

---

Made with ❤️ by Miguel Angel Pacheco