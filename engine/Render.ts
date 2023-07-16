import Application from './Application'
import { pollEvents } from './Input'
import { Scene, getActiveScene } from './SceneManager'

function renderLoop(timestamp = 0) {
  if (!Application.RUNNING) window.close()
  if (!Application.START) Application.START = timestamp
  const delta = timestamp - Application.PREVIOUS_TIME_STAMP
  if (delta > Application.TARGET_MS) Application.PREVIOUS_TIME_STAMP = timestamp
  const scene: Scene = getActiveScene()
  scene.objects.forEach(object => scene.camera.render(object))
  pollEvents()
  requestAnimationFrame(renderLoop)
}


export {renderLoop}