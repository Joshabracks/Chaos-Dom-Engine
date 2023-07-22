import { GameObject, getComponent } from './GameObject'
import { Image, Transform, ComponentType } from './Component'
import { Vector2, rectanglesIntersect, Rect } from './Math'
import { Viewport } from './Settings'
import APPLICATION from './Application'

let gameContainer: HTMLElement
let imageBucket: HTMLElement

/**
 * Gets position of camera in game world
 * @param camera Camera
 * @param pos Vector2
 * @returns Vector2
 */
function getCameraPosition(camera: Camera, pos: Vector2): Vector2 {
  return { x: pos.x - camera.position.x, y: pos.y - camera.position.y }
}

/**
 * Checks to see if GameObject is on screen according to the Camera 
 * @param camera Camera
 * @param gameObject GameObject
 * @returns boolean
 */
function isOnScreen(camera: Camera, gameObject: GameObject): boolean {
  const image = getComponent(gameObject, ComponentType.Image) as Image
  const transform = getComponent(gameObject, ComponentType.Transform) as Transform
  if (image === null || transform === null) return false
  
  const boundingBox = {width: image.element.width, height: image.element.height}
  const viewport = Viewport()
  const cameraBounds: Rect = {
    xMin: camera.position.x,
    xMax: camera.position.x + viewport.x,
    yMin: camera.position.y,
    yMax: camera.position.y + viewport.y
  }
  const imageBounds: Rect = {
    xMin: transform.position.x,
    xMax: transform.position.x + (typeof boundingBox.width === 'number' ? boundingBox.width : boundingBox.width.animVal.value),
    yMin: transform.position.y,
    yMax: transform.position.y + (typeof boundingBox.height === 'number' ? boundingBox.height : boundingBox.height.animVal.value)
  }
  return rectanglesIntersect(cameraBounds, imageBounds)
}

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
    if (!isOnScreen(this, object)) {
      if (image.element.parentElement !== imageBucket) imageBucket.appendChild(image.element)
      return
    }
    
    const transform = getComponent(object, ComponentType.Transform) as Transform
    if (!transform || !image) return
    if (image.element.parentElement !== gameContainer) gameContainer.appendChild(image.element)
    const onScreenPosition: Vector2 = getCameraPosition(this, transform.position)
    image.element.style.top = `${onScreenPosition.y * APPLICATION.SCALE}px`
    image.element.style.left = `${onScreenPosition.x * APPLICATION.SCALE}px`
  }
  
}

export default Camera
