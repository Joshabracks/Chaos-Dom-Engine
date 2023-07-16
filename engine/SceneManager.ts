import { error, warning } from './Logger'
import { GameObject, newGameObjectFromFile, newGameObjectFromJSON } from './GameObject'
import Camera from './Camera'
import { SAVE_JSON_CODE, loadJSON, saveJSON } from './file'
import { ComponentType } from './Component'

let ACTIVE_SCENE = 0
const SCENES: Scene[] = []

interface Scene {
  name: string
  objects: GameObject[]
  camera: Camera
}

function newScene(name = ''): number {
  if (!name) {
    name = `Untitled Scene ${SCENES.length}`
  }
  const scene: Scene = {
    name: name,
    objects: [],
    camera: new Camera()
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
    const gameObject: GameObject | null = newGameObjectFromJSON(object) || newGameObjectFromFile(object) || null
    if (gameObject !== null) objects.push(gameObject)
  })
  const camera: Camera = new Camera()
  if (json.camera && json.camera.position && json.camera.position.x && json.camera.position.y) {
    camera.position = {x: json.camera.position.x, y: json.camera.position.y}
  }
  const scene: Scene = {
    name: json.name,
    objects: objects,
    camera: camera
  }
  SCENES.push(scene)
  return SCENES.length - 1
}

function newSceneFromFile(filepath: string): number {
  const file = loadJSON(filepath)
  if (file.error) {
    error(file.error)
    return -1
  }
  const result: number = newSceneFromJSON(file)
  if (result === -1) {
    error(`Unable to load Scene from file ${filepath}`)
  }
  return result
}

function loadScenesFromFile(filepath: string) {
  const file = loadJSON(filepath)
  if (file.error) {
    error(file.error)
  }
  file.forEach((sceneObject: any) => {
    newSceneFromJSON(sceneObject)
  })
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

function saveState(filepath: string, filename: string, override = false): SAVE_JSON_CODE {
  function serializeGameObject(object: GameObject): any {
    const serializer = new XMLSerializer()
    return {
      active: object.active,
      children: object.children.map(serializeGameObject),
      components: object.components.map(component => {
        switch(component.type) {
        case ComponentType.Transform:
          return component
        case ComponentType.Image:
          return {
            type: component.type,
            active: component.active,
            depth: component.depth,
            colors: component.colors,
            element: serializer.serializeToString(component.element),
            ...component
          }
        default:
          return component
        }
      }),
      ...object
    }
  }
  const result = {
    ACTIVE_SCENE: ACTIVE_SCENE,
    SCENES: SCENES.map(scene => {
      return {
        name: scene.name,
        objects: scene.objects.map(serializeGameObject),
        camera: {
          position: scene.camera.position
        }
      }
    })
  }
  return saveJSON(filepath, filename, result, override)
}

function loadState(filepath: string) {
  const file = loadJSON(filepath)
  if (!file.SCENES) return false
  if (file.ACTIVE_SCENE) ACTIVE_SCENE = file.ACTIVE_SCENE
  document.querySelector('#game').innerHTML = ''
  document.querySelector('#image-bucket').innerHTML = ''
  console.log('map scenes')
  const loadedScenes: Scene[] = file.SCENES.map((scene: {camera: any; name: any; objects: any[] }) => {
    const camera = new Camera()
    camera.position = scene.camera.position
    console.log('map objects')
    return {
      name: scene.name,
      objects: scene.objects.map(newGameObjectFromJSON),
      camera: camera
    }
  })
  while (SCENES.length) SCENES.pop()
  while (loadedScenes.length) SCENES.push(loadedScenes.shift())
  return true
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
  newSceneFromFile,
  loadScenesFromFile,
  newScene, 
  getActiveScene,
  saveState,
  loadState
}
