export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options?: Record<string, string | number> | null,
  children?: string | HTMLElement | Array<HTMLElement | string>
): HTMLElementTagNameMap[K] => {
  const oEl = document.createElement(tagName)

  if (options) {
    Object.entries(options).forEach(([key, value]) => {
      oEl.setAttribute(key, `${value}`)
    })
  }

  if (children) {
    if (typeof children === 'string') {
      oEl.textContent = children
    } else if (Array.isArray(children)) {
      children.forEach(child => {
        if (typeof child === 'string') {
          oEl.appendChild(document.createTextNode(child))
        } else {
          oEl.appendChild(child)
        }
      })
    } else {
      oEl.appendChild(children)
    }
  }

  return oEl
}

export const getScrollOffset = (): { left: number, top: number } => {
  if (window.pageXOffset) {
    return {
      left: window.pageXOffset,
      top: window.pageYOffset
    }
  } else {
    return {
      left: document.documentElement.scrollLeft + document.body.scrollLeft,
      top: document.documentElement.scrollTop + document.body.scrollTop
    }
  }
}

export const getPagePos = (e: MouseEvent): { x: number, y: number } => {
  // 获取鼠标相对于可视窗口的坐标
  const clientX = e.clientX
  const clientY = e.clientY
  // 获取滚动条距离
  const {
    left: scrollLeft,
    top: scrollTop
  } = getScrollOffset()
  // 获取文档偏移量，如果不存在，就给0，不影响计算
  const offsetX = document.documentElement.offsetLeft || 0
  const offsetY = document.documentElement.offsetTop || 0

  return {
    x: clientX + scrollLeft - offsetX,
    y: clientY + scrollTop - offsetY
  }
}
