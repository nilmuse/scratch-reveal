# scratch-reveal

Scratch away a canvas mask to reveal a background image, using a custom brush image.

[![npm](https://img.shields.io/npm/v/scratch-reveal.svg?colorB=brightgreen)](https://www.npmjs.com/package/scratch-reveal)
[![NPM Downloads](https://img.shields.io/npm/dm/scratch-reveal.svg?style=flat)](https://www.npmjs.com/package/scratch-reveal)

[Demo](https://codepen.io/ux-ui/pen/WbxvZqY)

## Installation

```bash
npm install scratch-reveal
```

## Quick start

Provide three images in your app's public assets:

- `/assets/brush.png`: the brush shape. Opaque pixels erase the mask; transparent pixels leave it untouched.
- `/assets/scratch-reveal.png`: the mask to scratch away.
- `/assets/scratch-reveal-background.svg`: the image underneath.

The package does not include these images. Use same-origin images, or serve them with CORS headers that allow canvas pixel reads.

Register the custom element in your browser entry point:

```ts
import { registerScratchRevealElement } from 'scratch-reveal';

registerScratchRevealElement();
```

Add the markup:

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

Drag across the mask to reveal the image. Once more than 60% has been cleared, the remaining mask fades out. Default styles are installed inside the element's shadow root.

## API

- `registerScratchRevealElement(tagName?)` defines `<scratch-reveal>` or a custom tag. Repeated calls for an already registered tag do nothing.
- `installScratchReveal(app)` registers the default tag and sets `app.config.globalProperties.$scratchReveal` to `true`.
- `scratchRevealCssText` exports the packaged minified CSS text.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `width` / `height` | `number` | Layout size when omitted | Explicit canvas size in pixels. Without a measurable layout size, initialization can use the mask's natural size or a `300` px fallback. |
| `complete-percent` | `number` | `0` when absent | Complete when the cleared percentage is strictly greater than this value. Set `60` for the behavior in the example. |
| `brush-src` | `string` | Absent; required | Brush image URL. |
| `brush-size` | Numeric string or pixel string | `0` | Brush width as a percentage of the smaller canvas dimension, such as `15` or `15%`. Use `80px` for pixels. `0` uses the image's natural size. |
| `mask-src` | `string` | Absent; required | Mask image URL. |
| `background-src` | `string` | Absent; required | Background image URL. |
| `show-status` | Boolean attribute | Absent (`false`) | Show waiting or error messages. Presence enables it, including `show-status="false"`. |

In the current custom element, an omitted or empty `complete-percent` becomes `0`. A value that cannot be parsed as a finite number falls back to `60`.

Changing `brush-size` updates the brush without rebuilding. Changing width or height updates the canvas size; resizing an unfinished canvas resets its scratch progress. Changing image sources, `complete-percent`, or `show-status` rebuilds the scratch surface.

### Events

Events bubble and cross shadow boundaries. Listen on the element after its markup is available:

```ts
const element = document.querySelector('scratch-reveal');

element?.addEventListener('progress', (event) => {
  console.log((event as CustomEvent<{ percent: number }>).detail.percent);
});

element?.addEventListener('complete', () => {
  console.log('Reveal complete');
});

element?.addEventListener('error', (event) => {
  console.error((event as CustomEvent<{ message: string }>).detail.message);
});
```

| Event | When | Payload (`event.detail`) |
| --- | --- | --- |
| `progress` | While scratching; pointer-move updates are throttled. | `{ percent: number }` |
| `complete` | Once per surface when the cleared percentage exceeds the threshold. | `{ percent: 100 }` |
| `error` | When image loading or initialization fails. | `{ message: string }` |

The `complete` payload reports `100` when completion begins, before the remaining mask finishes fading. Missing required attributes leave the component waiting; `show-status` makes that state visible.

## Size to a container

Omit `width` and `height` and give the element a layout size:

```html
<div style="width: 420px; height: 240px;">
  <scratch-reveal
    style="display: block; width: 100%; height: 100%;"
    complete-percent="60"
    show-status
    brush-size="12"
    brush-src="/assets/brush.png"
    mask-src="/assets/scratch-reveal.png"
    background-src="/assets/scratch-reveal-background.svg"
  ></scratch-reveal>
</div>
```

The element observes its size and resizes the canvas. Resizing an unfinished surface clears the scratch progress.

## Vue 3.5+

For Vue 3 with Vite, mark the tag as a custom element in `vite.config.ts`:

```ts
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'scratch-reveal',
        },
      },
    }),
  ],
});
```

With the three image files from Quick start available, this component registers the element and displays the scratch surface:

```vue
<script setup lang="ts">
import { registerScratchRevealElement } from 'scratch-reveal';

registerScratchRevealElement();
</script>

<template>
  <scratch-reveal
    width="300"
    height="300"
    complete-percent="60"
    brush-size="15"
    brush-src="/assets/brush.png"
    mask-src="/assets/scratch-reveal.png"
    background-src="/assets/scratch-reveal-background.svg"
    show-status
  ></scratch-reveal>
</template>
```

To register once in your app entry instead, use the plugin helper:

```ts
import { createApp } from 'vue';
import { installScratchReveal } from 'scratch-reveal';
import App from './App.vue';

const app = createApp(App);

installScratchReveal(app);
app.mount('#app');
```

For Vue tooling that needs a global tag declaration, add a local `scratch-reveal.d.ts`:

```ts
import type { ComponentPublicInstance } from 'vue';

declare module 'vue' {
  export interface GlobalComponents {
    'scratch-reveal': ComponentPublicInstance;
  }
}
```

The type declaration supplements the compiler setting; it does not replace it.

## Styling

The element installs its Shadow DOM styles using constructable stylesheets with a `<style>` fallback. Set the host's dimensions in your app CSS when using automatic sizing.

`scratchRevealCssText` is available for your own CSS pipeline. A sidecar stylesheet is also exported:

```ts
import 'scratch-reveal/scratch-reveal.css';
```

Document-level stylesheet imports do not override styles inside the shadow root.

## License

MIT
