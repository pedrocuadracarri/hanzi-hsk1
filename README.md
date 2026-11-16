# Hanzi HSK 1

PWA gratuita y sin backend para aprender los 150 caracteres del HSK 1, en español. Funciona offline y se puede instalar en el móvil y en el PC.

## Qué incluye

- **Aprender**: guía para principiantes (pinyin, tonos, cambios de tono, cómo se forman los caracteres, orden de trazos, primeras frases), con audio.
- **Practicar**: Repaso mixto, Emparejar (emoji, significado, pinyin, piezas), Tarjetas, Escuchar, Escribir con el dedo (con pistas o dictado) y Tonos. Las palabras nuevas se presentan antes de practicarlas.
- **Repaso espaciado** Leitner de 5 cajas: lo que fallas vuelve antes.
- **Palabras y Componentes**: fichas con mnemotecnia, piezas, audio y animación de trazos; buscador.
- **Progreso**: racha, objetivo diario, calendario, previsión de repasos, cajas, temas y palabras difíciles.
- **Atajos de teclado** en el PC (espacio, ←/→, 1–4) y tema claro/oscuro en Ajustes.
- **Sincronización** entre dispositivos con un Gist privado de GitHub (opcional), o exportar/importar un archivo.

Lo que viene: [ROADMAP.md](ROADMAP.md).

## Desarrollo

```bash
npm install
npm run dev:host   # abre en el móvil la URL «Network» (misma wifi)
npm test
npm run build && npm run preview
```

## Despliegue en GitHub Pages

1. Sube el repo a GitHub (rama `main`).
2. Settings › Pages › Source: **GitHub Actions**.
3. Cada push a `main` pasa los tests y publica en `https://<usuario>.github.io/<repo>/`.

También hay `netlify.toml` listo para Netlify.

## Datos

`src/data/hsk1.json`: 150 palabras con pinyin (tildes y numérico), significado, emoji, componentes, mnemotecnia y categoría. Las entradas con `needsReview: true` tienen una descomposición o mnemotecnia dudosa. Para añadir HSK 2, crea `hsk2.json` y regístralo en `src/data/index.ts`.
