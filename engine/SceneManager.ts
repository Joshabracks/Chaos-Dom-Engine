import { error, warning } from './Logger'
// import { GameObject, newGameObjectFromFile, newGameObjectFromJSON } from './GameObject'
import { GameObject, newGameObjectFromJSON } from './GameObject'
import Camera from './Camera'
// import { SAVE_JSON_CODE, loadJSON, saveJSON } from './file'
// import { ComponentType } from './Component'

let ACTIVE_SCENE = 0
const SCENES: Scene[] = []

interface Scene {
  name: string
  objects: GameObject[]
  cameras: Camera[]
}

function newScene(name = ''): number {
  if (!name) {
    name = `Untitled Scene ${SCENES.length}`
  }
  const scene: Scene = {
    name: name,
    objects: [],
    cameras: []
  }
  SCENES.push(scene)
  return SCENES.length - 1
}

function newSceneFromJSON(json: any): number {
  const errors = []
  if (!json.name) errors.push('Scene is missing entry "name": string')
  if (!json.objects || !json.objects.length) errors.push('Scene is missing entry "objects": GameObject[]')
  if (errors.length) {
    error(`${errors.join('\n')}`)
    return -1
  }
  const objects: GameObject[] = []
  json.objects.forEach((object: any) => {
    const gameObject: GameObject | null = newGameObjectFromJSON(object) || null
    if (gameObject !== null) objects.push(gameObject)
  })
  const cameras: Camera[] = []
  if (json.cameras) {
    json.cameras.forEach(obj => {
      if (!obj.height || !obj.width) return
      const camera = new Camera()
      if (obj && obj.position && obj.position.x && obj.position.y) {
        camera.position = {x: obj.position.x, y: obj.position.y}
      }
      camera.cameraId = obj.cameraId
      camera.init(obj.width, obj.height)
      document.body.appendChild(camera.canvas)
      cameras.push(camera)
    })
  }
  const scene: Scene = {
    name: json.name,
    objects: objects,
    cameras: cameras
  }
  SCENES.push(scene)
  return SCENES.length - 1
}

function loadScene(index: number): boolean;
function loadScene(name: string): boolean;
function loadScene(input: unknown): boolean {
  switch (typeof input) {
  case 'number':
    if (SCENES[input]) {
      ACTIVE_SCENE = input
      return true
    }
    break
  case 'string':
    {
      const length = SCENES.length
      for (let i = 0; i < length; i++) {
        const scene = SCENES[i]
        if (scene && scene.name === input) {
          ACTIVE_SCENE = i
          return true
        }
      }
    }
    break
  default:
    break
  }
  warning(
    `Unable to find scene ${
      typeof input === 'string' ? 'with name' : 'at index'
    } ${input}`
  )
  return false
}

function getActiveScene() {
  return SCENES[ACTIVE_SCENE]
}

function getAllScenes(): Scene[] {
  return SCENES
}


export { 
  Scene, 
  getAllScenes,
  loadScene,
  newSceneFromJSON,
  newScene, 
  getActiveScene,
}
