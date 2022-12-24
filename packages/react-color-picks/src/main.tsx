import React, { FC, useEffect, useRef, PropsWithChildren } from 'react'
import ColorPicks, { ColorPicksOptions } from 'color-picks'
import 'color-picks/index.css'

export interface ReactColorPicksProps extends PropsWithChildren {
  value?: string
  outputType?: ColorPicksOptions['outputType']
  theme?: ColorPicksOptions['theme']
  onChange?: (color: string) => unknown
}

const ReactColorPicks: FC<ReactColorPicksProps> = ({
  value,
  outputType,
  theme,
  children,
  onChange
}) => {
  const targetRef = useRef(null)
  const handleChange = onChange ?? (() => {})

  useEffect(() => {
    if (targetRef.current) {
      const colorPicks = new ColorPicks(targetRef.current, {
        outputType: outputType ?? 'HEX',
        theme: theme ?? 'dark'
      })
      colorPicks.setColor(value ?? '#ffffff')
      colorPicks.on('confirm', (val: string) => {
        handleChange(val)
      })
    }
  }, [targetRef])

  return (
    <div
      ref={ targetRef }
      style={{
        width: 'fit-content'
      }}
    >
      { children }
    </div>
  )
}

export default ReactColorPicks
