import { GameObject, getComponent } from './GameObject'
import { Image, Transform, ComponentType } from './Component'
import { Rect, Vector2 } from './Math'
import APPLICATION from './Application'
import { Scene } from './SceneManager'

/**
 * Gets position of camera in game world
 * @param camera Camera
 * @param pos Vector2
 * @returns Vector2
 */
function getCameraPosition(camera: Camera, pos: Vector2): Vector2 {
  return { x: pos.x - camera.position.x, y: pos.y - camera.position.y }
}

function rectanglesIntersect(
  minAx: number, minAy: number, maxAx: number, maxAy: number,
  minBx: number, minBy: number, maxBx: number, maxBy: number ): boolean {
  const aLeftOfB = maxAx < minBx
  const aRightOfB = minAx > maxBx
  const aAboveB = minAy > maxBy
  const aBelowB = maxAy < minBy

  return !( aLeftOfB || aRightOfB || aAboveB || aBelowB )
}

class Camera {
  position: Vector2 = {x: 0, y: 0}
  zoom: number = 1
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  active: boolean
  cameraId: string
  init(width: number, height: number, screenPos: Vector2, screenDepth: number) {
    this.active = true
    this.canvas = document.createElement('canvas')
    this.canvas.setAttribute('camera-id', this.cameraId)
    this.canvas.width = width
    this.canvas.height = height
    this.canvas.style.top = `${screenPos.y}`
    this.canvas.style.left = `${screenPos.x}`
    this.canvas.style.zIndex = `${screenDepth}`
    this.canvas.style.position = 'absolute'
    this.context = this.canvas.getContext('2d')
    document.querySelector('body').appendChild(this.canvas)
  }
  renderAll(scene: Scene) {
    const cameraBounds: Rect = {
      xMin: this.position.x,
      xMax: this.position.x + ((this.canvas.height - this.position.y) * APPLICATION.SCALE * this.zoom),
      yMin: this.position.y,
      yMax: this.position.y + ((this.canvas.height - this.position.y) * APPLICATION.SCALE * this.zoom)
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    scene.objects.forEach((object) => this.render(object, cameraBounds))
  }
  render(object: GameObject, cameraBounds: Rect) {
    // Skip rendering if object is not active
    if (!object.active) return
    const image = getComponent(object, ComponentType.Image) as Image
    const transform = getComponent(object, ComponentType.Transform) as Transform
    // Skip rendering if object does not have transform and image components
    if (!transform || !image) return
    // Check to see if object is on screen
    const imageBounds: Rect = {
      xMin: transform.position.x,
      xMax: transform.position.x + (image.element.width * transform.scale.x * this.zoom),
      yMin: transform.position.y,
      yMax: transform.position.y + (image.element.height * transform.scale.y * this.zoom)
    }
    // Skip rendering if object is not on screen
    if (!rectanglesIntersect(
      cameraBounds.xMin, cameraBounds.yMin, cameraBounds.xMax, cameraBounds.yMax,
      imageBounds.xMin, imageBounds.yMin, imageBounds.xMax, imageBounds.yMax
    )) return
    // Get Onscreen position and scale
    const onScreenPosition: Vector2 = getCameraPosition(this, transform.position)
    const scale: Vector2 = {
      x: APPLICATION.SCALE * transform.scale.x,
      y: APPLICATION.SCALE * transform.scale.y
    }
    // Apply transformations and render object
    this.context.save()
    if (transform.rotation) this.context.rotate(transform.rotation)
    this.context.translate(onScreenPosition.x * scale.x, onScreenPosition.y * scale.y)
    this.context.drawImage(
      image.element,
      -(onScreenPosition.x * scale.x), 
      -(onScreenPosition.y * scale.y),
      image.element.width * scale.x, 
      image.element.height * scale.y
    )
    this.context.restore()
  }
}

export default Camera
