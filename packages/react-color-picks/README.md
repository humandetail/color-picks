# react-color-picks

color-picks for react.

## Install

Install with npm:

```bash
npm i react-color-picks
```

Install with yarn:

```bash
yarn add react-color-picks
```

Install with pnpm:

```bash
pnpm add react-color-picks
```

## Usage

```tsx
import React, { FC } from 'react'
import { createRoot } from 'react-dom/client'
import ReactColorPicks from 'react-color-picks'
import 'react-color-picks/index.css'

const App: FC = () => {
  const handleChange = (color: string): void => {
    document.body.style.backgroundColor = color
  }

  return (
    <div>
      <ReactColorPicks
        onChange={ handleChange }
      >
        <button>Trigger</button>
      </ReactColorPicks>
    </div>
  )
}

const root = createRoot(document.querySelector('#root')!)

root.render(<App />)
```
