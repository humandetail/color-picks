# color-picks

A color picker ui for browser.

## Install

Install with npm:

```bash
npm i color-picks
```

Install with yarn:

```bash
yarn add color-picks
```

Install with pnpm:

```bash
pnpm add color-picks
```

## Usage

html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Color Picks</title>
  </head>
  <body>
    <div id="app">
      <button class="trigger">Click me.</button>
    </div>
    <script type="module" src="/src/index.ts"></script>
  </body>
</html>
```

`src/index.ts`

```typescript
import ColorPicks from 'color-picks'
import 'color-picks/index.css'

const colorPicks = new ColorPicks('.trigger')
// optional
colorPicks.setColor('#ffffff')

colorPicks.on('confirm', (color: string) => {
  document.body.style.background = color
})
```

## Params

| param          | type                     | default | description       |
| -------------- | ------------------------ | ------- | ----------------- |
| triggerElement | string \| HTMLElement    | -       | Trigger element   |
| outputType     | 'HEX' \| 'RGB' \| 'RGBA' | 'HEX'   | Output color type |
| theme          | 'light' \| 'dark'        | 'dark'  | Theme             |

