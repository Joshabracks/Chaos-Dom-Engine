import { GameObject, getComponent } from './GameObject'
import { Image, Transform, ComponentType } from './Component'
import { Vector2 } from './Math'
import APPLICATION from './Application'
import { resizeSVG } from './Resize'

let gameContainer: HTMLElement
let imageBucket: HTMLElement

class Camera {
  position: Vector2 = {x: 0, y: 0}
  render(object: GameObject) {
    if (!gameContainer) gameContainer = document.querySelector('#game') as HTMLElement
    if (!imageBucket) imageBucket = document.querySelector('#image-bucket') as HTMLElement
    if (!object.active) {
      imageBucket.appendChild(getComponent(object, ComponentType.Image)?.element)
      return
    }
    const image = getComponent(object, ComponentType.Image) as Image
    if (!object.active) {
      if (image.element.parentElement !== imageBucket) imageBucket.appendChild(image.element)
      return
    }
    
    const transform = getComponent(object, ComponentType.Transform) as Transform
    if (!transform || !image) return
    if (image.element.parentElement !== gameContainer) gameContainer.appendChild(image.element)
    
    const scale: Vector2 = {
      x: APPLICATION.SCALE * transform.scale.x,
      y: APPLICATION.SCALE * transform.scale.y
    }
    resizeSVG(image.element as SVGSVGElement, scale)
    image.element.style.transform = `rotate(${transform.rotation}deg)`
    const yPos: string = `${transform.position.y * APPLICATION.SCALE}px`
    const xPos: string = `${transform.position.x * APPLICATION.SCALE}px`
    if (image.element.style.top !== yPos) image.element.style.top = yPos
    if (image.element.style.left !== xPos) image.element.style.left = xPos
  }
  
}

export default Camera
