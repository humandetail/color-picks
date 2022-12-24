import { FC } from 'react'
import { createRoot } from 'react-dom/client'

import ReactColorPicks from 'react-color-picks'
import 'react-color-picks/index.css'

const App: FC = () => {
  const handleChange = (color: string): void => {
    const oTarget = document.querySelector<HTMLElement>('.target')

    if (oTarget) {
      oTarget.style.backgroundColor = color
    }
  }

  return (
    <div>
      <ReactColorPicks
        onChange={ handleChange }
      >
        <button>React 选择背景颜色</button>
      </ReactColorPicks>
    </div>
  )
}

const root = createRoot(document.querySelector('#react-root')!)

root.render(<App />)
