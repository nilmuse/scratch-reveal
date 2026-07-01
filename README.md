# scratch-reveal

Web Component for scratch-to-reveal: canvas mask, background beneath it, and a custom brush. Works in plain browsers and Vue 3.

[![npm](https://img.shields.io/npm/v/scratch-reveal.svg?colorB=brightgreen)](https://www.npmjs.com/package/scratch-reveal)
[![NPM Downloads](https://img.shields.io/npm/dm/scratch-reveal.svg?style=flat)](https://www.npmjs.com/package/scratch-reveal)

[Demo](https://codepen.io/ux-ui/pen/WbxvZqY)

---

- Registers `<scratch-reveal>` with shadow DOM and constructable stylesheet fallback.
- Canvas mask scratched away by a custom brush image; reveals a background layer underneath.
- Configurable completion threshold, brush size (percent or pixels), and auto-size mode.
- Dispatches `progress`, `complete`, and `error` events (`bubbles` + `composed` for shadow DOM).
- Ships `scratchRevealCssText` and a CSS sidecar; optional Vue 3 plugin helper.

---

## Installation

```bash
npm install scratch-reveal
```

Optional stylesheet (sidecar):

```ts
import 'scratch-reveal/scratch-reveal.css';
```

## Quick Start

Register the custom element, then use it in markup:

```ts
import { registerScratchRevealElement } from 'scratch-reveal';

registerScratchRevealElement();
```

```html
<scratch-reveal
  width="300"
  height="300"
  complete-percent="60"
  show-status
  brush-size="15"
  brush-src="/assets/brush.png"
  mask-src="/assets/scratch-reveal.png"
  background-src="/assets/scratch-reveal-background.svg"
></scratch-reveal>
```

### Auto-size (follow parent/container)

```html
<div style="width: 420px; height: 240px;">
  <scratch-reveal
    style="width: 100%; height: 100%;"
    complete-percent="60"
    show-status
    brush-size="12"
    brush-src="/assets/brush.png"
    mask-src="/assets/scratch-reveal.png"
    background-src="/assets/scratch-reveal-background.svg"
  ></scratch-reveal>
</div>
```

If `width` / `height` attributes are omitted, the component observes its own size and resizes the canvas accordingly.

## API

- **`registerScratchRevealElement(tagName?)`** — defines `<scratch-reveal>` (or a custom tag name). Safe to call multiple times.
- **`installScratchReveal(app)`** — Vue 3 plugin helper; calls `registerScratchRevealElement()` and sets `app.config.globalProperties.$scratchReveal`.
- **`scratchRevealCssText`** — minified default CSS text shipped with the package.

## Options

| Attribute | Type | Default | Description |
|:----------|:-----|:--------|:------------|
| `width` / `height` | `number` | `300` | Container/mask size in px. If omitted, size follows layout (auto-size). |
| `complete-percent` | `number` | `60` | Percent cleared to consider done. |
| `brush-src` | `string` | — | Brush image (**required**). |
| `brush-size` | `string` \| `number` | `0` | Brush width: numbers mean percent of min(canvas width, height) (e.g. `12` = 12%). Use `80px` for px. `0` = natural image size. |
| `mask-src` | `string` | — | Top mask (scratched away) (**required**). |
| `background-src` | `string` | — | Background beneath the mask (**required**). |
| `show-status` | `boolean` | — | Optional: render status message for missing attrs / errors (useful in development). |

## Events

Listen on the element (events bubble and cross shadow boundaries):

```js
const el = document.querySelector('scratch-reveal');
el.addEventListener('progress', (event) => {
  console.log(event.detail.percent);
});
el.addEventListener('complete', () => {
  console.log('done!');
});
el.addEventListener('error', (event) => {
  console.error(event.detail.message);
});
```

| Event | Detail | Description |
|:------|:-------|:------------|
| `progress` | `{ percent: number }` | Fired while scratching (throttled). |
| `complete` | `{ percent: 100 }` | Fired once when the threshold is reached. |
| `error` | `{ message: string }` | Fired on load or configuration errors. |

## Styling

Shadow styles use constructable stylesheets with a `<style>` fallback for older browsers.

Reuse the shipped CSS text:

```ts
import { scratchRevealCssText } from 'scratch-reveal';
// apply wherever you need
```

Or import the sidecar:

```ts
import 'scratch-reveal/scratch-reveal.css';
```

## Vue 3.5+

```ts
import { createApp } from 'vue';
import { installScratchReveal } from 'scratch-reveal';

const app = createApp(App);
installScratchReveal(app);
app.mount('#app');
```

For Volar/templates, set `isCustomElement` in `vite.config.ts`, or rely on the shipped `src/vue.d.ts` (global component `scratch-reveal`).

## License

MIT
