# 🍄 Isla Fungi — Sitio Web

Sitio web profesional para Isla Fungi — extractos de hongos medicinales (Melena de León y Cordyceps). Construido con HTML5, CSS3 y JavaScript vanilla, sin dependencias externas (excepto Google Fonts).

## 📁 Estructura

```
isla-fungi/
├── index.html        # Estructura + contenido
├── styles.css        # Todos los estilos (tokens, layout, animaciones, responsive)
├── script.js         # Carrito, menú móvil, animaciones scroll
└── images/
    ├── logo.jpg
    ├── melena-de-leon.jpg
    └── cordyceps.png
```

## 🎨 Sistema de diseño

**Paleta** (definida en `:root` de styles.css):
- `--ocean-deep` #0d4a5a — primario
- `--coral` #e55b3c — CTA / acento
- `--sunset` #e88c3d — acento cálido
- `--sand`, `--sand-light`, `--cream` — neutros
- `--mushroom` #3a2418 — oscuros / footer

**Tipografías** (Google Fonts):
- **Shrikhand** — display, titulares (feel surf-retro)
- **Fraunces** — acentos en itálica
- **DM Sans** — cuerpo

**Componentes clave**: botones, cards de producto, drawer de carrito, nav sticky, benefit cards glassmorphism, hero con olas SVG animadas.

## 🛒 Carrito

- Estado persistido en `localStorage` (sobrevive al refresh)
- Drawer lateral con overlay
- Cantidad editable, eliminar item
- Checkout → arma mensaje a WhatsApp con el pedido (listo para producción mientras no haya pasarela)

### Para cambiar precios / productos

En `script.js`, top del archivo:

```js
const PRODUCTS = {
  melena: { id: 'melena', name: 'Melena de León', price: 15000, ... },
  cordyceps: { id: 'cordyceps', name: 'Cordyceps', price: 13000, ... }
};
```

Y en los botones del HTML:
```html
<button class="btn-add" data-add="melena" data-name="Melena de León" data-price="15000">
```

## 📱 WhatsApp

En `index.html` y `script.js` busca y reemplaza `56900000000` por tu número real (código país + número, sin + ni espacios).

## 🚀 Camino hacia e-commerce completo

El código está armado pensando en escalar. Siguientes pasos sugeridos:

1. **Pasarela de pago** — Integrar Flow, Mercado Pago o Transbank:
   - El método `checkoutBtn` en `script.js` es el punto de entrada. Reemplaza el `window.open(wa.me...)` por una llamada a tu backend que genere la transacción.

2. **Backend** — Opciones ligeras:
   - **Shopify Lite** + este front como landing
   - **WooCommerce** (WordPress)
   - **Node + Stripe/Flow API** custom
   - **Supabase** para catálogo + órdenes

3. **CMS para productos** — Mover `PRODUCTS` a una API:
   - Sanity, Contentful, o tabla Supabase/Firebase

4. **Analytics**:
   - GA4 en `<head>`
   - Pixel de Meta para retargeting de IG ads
   - Eventos: `add_to_cart`, `begin_checkout`, `purchase`

5. **SEO**:
   - Generar sitemap.xml
   - Schema.org `Product` markup (JSON-LD) para cada producto → aparece en Google Shopping
   - Open Graph ya está configurado para que se vea lindo al compartir

6. **Optimización**:
   - Convertir imágenes a `.webp` (reduce ~60% peso)
   - `loading="lazy"` en imágenes bajo el fold
   - Minificar CSS/JS para producción

## 🧪 Testing local

Abre `index.html` directamente en el navegador — funciona. Para testing más "real" (server-side) corre un server estático:

```bash
cd isla-fungi
python3 -m http.server 8000
# Visita http://localhost:8000
```

## ✅ Checklist antes de publicar

- [ ] Reemplazar número de WhatsApp (`56900000000`)
- [ ] Actualizar email real (`hola@islafungi.cl`)
- [ ] Conectar dominio + SSL
- [ ] Meta descripción + OG image definitivos
- [ ] Agregar pixel de Meta + GA4
- [ ] Probar en móvil real (Safari iOS + Chrome Android)
- [ ] Comprimir imágenes a webp

---

Hecho con 🌊 por la isla.
