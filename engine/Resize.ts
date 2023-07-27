import Application from './Application'
import { Vector2 } from './Math'
import { Settings } from './Settings'

const PREVIOUS_SIZE: Vector2 = {
  x: Settings()['viewport-x'],
  y: Settings()['viewport-y'],
}

function onResize(scaleMultiplier = 1) {
  function resizeSVG(svg: SVGSVGElement, scale: number) {
    const originalHeight = parseInt(
      svg.getAttribute('original-height') as string
    )
    const originalWidth = parseInt(
      svg.getAttribute('original-width') as string
    )
    svg.setAttribute('height', `${originalHeight * scale}`)
    svg.setAttribute('width', `${originalWidth * scale}`)
  }
  Application.SCALE *= scaleMultiplier
  document
    .querySelectorAll('svg')
    .forEach((image) => resizeSVG(image, Application.SCALE))
}

function initResize() {
  window.addEventListener('resize', () => {
    const widthScale = window.innerWidth / PREVIOUS_SIZE.x
    const heightScale = window.innerHeight / PREVIOUS_SIZE.y
    const scaleDiffX = Math.abs(window.innerWidth - PREVIOUS_SIZE.x)
    const scaleDiffY = Math.abs(window.innerHeight - PREVIOUS_SIZE.y)
    const scaleMultiplier = scaleDiffX >= scaleDiffY ? widthScale : heightScale
    PREVIOUS_SIZE.x = window.innerWidth
    PREVIOUS_SIZE.y = window.innerHeight
    onResize(scaleMultiplier)
  })
  setTimeout(() => {window.dispatchEvent(new Event('resize'))}, 50)
}

export { onResize, initResize }
