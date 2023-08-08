import Application from './Application'
import { GameObject } from './GameObject'
import { pollEvents } from './Input'
import { Scene, getActiveScene } from './SceneManager'

function renderObjectRecursive(object: GameObject, scene: Scene, delta: number) {
  if (object.update && object.active) object.update(object, delta)
  scene.cameras.forEach((camera) => camera.renderAll(scene))
  object.children.forEach((child: GameObject) => renderObjectRecursive(child, scene, delta))
}

function renderLoop(timestamp = 0) {
  if (!Application.RUNNING) window.close()
  if (!Application.START) Application.START = timestamp
  const delta = timestamp - Application.PREVIOUS_TIME_STAMP
  if (delta > Application.TARGET_MS) Application.PREVIOUS_TIME_STAMP = timestamp
  const scene: Scene = getActiveScene() as Scene
  pollEvents()
  scene.objects.forEach((object: GameObject) => renderObjectRecursive(object, scene, delta))
  requestAnimationFrame(renderLoop)
}

export {renderLoop}