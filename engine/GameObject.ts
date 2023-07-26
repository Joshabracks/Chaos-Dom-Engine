import * as Component from './Component'
// import { loadJSON } from './file'
// import { error } from './Logger'
import { loadSVG } from './ImageLoader'

interface GameObject {
  active: boolean
  components: Component.Component[]
  children: GameObject[]
  init?(props: any): any
}

/**
 * Builds new GameObject from given json object if possible
 * @param json 
 * @returns GameObject or null
 */
function newGameObjectFromJSON(json: any): GameObject | null {
  if (typeof json !== 'object') return null
  const components: Component.Component[] = []
  json.components.forEach(
    (component: {
        colors: {[key: string]: string};
        type: string;
        active: boolean;
        depth: number;
        position: {
          x: number;
          y: number;
        };
        scale: {
          x: number;
          y: number;
        };
        element: string;
      }) => {
      switch (component.type) {
      /* eslint-disable no-case-declarations */
      case Component.ComponentType.Image as string:
        const element = loadSVG(component.element, component.colors)
        if (element) {
          const image: Component.Image = {
            type: Component.ComponentType.Image,
            active: component.active,
            element: element,
            depth: component.depth,
            colors: component.colors
          }
          components.push(image)
        }
        break
      case Component.ComponentType.Transform as string:
        const transform: Component.Transform = {
          type: Component.ComponentType.Transform,
          active: component.active,
          position: { x: component.position.x, y: component.position.y },
          scale: { x: component.scale.x, y: component.scale.y },
        }
        components.push(transform)
        break
      }
      /* eslint-enable no-case-declarations */
    }
  )
  const children: GameObject[] = []
  if (json.children) {
    json.children.forEach((childData: string) => {
      const child: GameObject | null = newGameObjectFromJSON(childData)
      if (child) children.push(child)
    })
  }
  return {
    active: json.active,
    children: children,
    components: components,
  }
}

/**
 * Loads a GameObject from local file if possible
 * @param filepath Exact path to json file to be loaded
 * @returns GameObject or null
 */
// function newGameObjectFromFile(filepath: string): GameObject | null {
//   const file = loadJSON(filepath)
//   if (file.error) {
//     error(file.error)
//     return null
//   }
//   return newGameObjectFromJSON(file)
// }

/**
 * Get component of specifit type from a GameObject if it exists
 * @param gameObject GameObject
 * @param type Component.ComponentType
 * @returns Component or null
 */
function getComponent(
  gameObject: GameObject,
  type: Component.ComponentType
): Component.Component | Component.Transform | Component.Image | null {
  let i = 0
  while (i < gameObject.components.length) {
    if (gameObject.components[i]?.type === type) return gameObject.components[i] as Component.Component
    i++
  }
  return null
}

/**
 * Returns component index from GameObject if it exists
 * @param gameObject GameObject
 * @param type Component.ComponentType
 * @returns number
 */
function getComponentIndex(
  gameObject: GameObject,
  type: Component.ComponentType
): number {
  let i = 0
  while (i < gameObject.components.length) {
    if (gameObject.components[i]?.type === type) return i
    i++
  }
  return -1
}

/**
 * Returns deep copy of GameObject
 * @param gameObject 
 * @returns GameObject
 */
function copy(gameObject: GameObject): GameObject {
  const object: GameObject = {
    'active': gameObject.active,
    'children': [],
    'components': []
  }
  gameObject.children.forEach(child => object.children.push(copy(child)))
  gameObject.components.forEach(component => object.components.push(Component.copy(component)))
  return object
}

export { 
  copy,
  GameObject, 
  // newGameObjectFromFile, 
  newGameObjectFromJSON, 
  getComponent,
  getComponentIndex
}
