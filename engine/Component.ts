/* eslint-disable no-case-declarations */
import { Vector2 } from './Math'

enum ComponentType {
  Transform = 'transform',
  Image = 'image',
}

interface Component {
  [x: string]: any
  active: boolean
  type: ComponentType
} 

interface Transform extends Component {
  type: ComponentType.Transform
  position: Vector2
  rotation: number
  scale: Vector2
  velocity: Vector2
  speed: number
}

interface Image extends Component {
  type: ComponentType.Image
  element: HTMLImageElement
  depth: number,
  colors: {[key: string]: string}
}

/**
 * Makes deep copy of provided component
 * @param component 
 * @returns Component
 */
function copy(component: any): Component | null {
  switch(component.type) {
  case ComponentType.Transform:
    return {
      type: ComponentType.Transform,
      active: JSON.parse(JSON.stringify(component.active)),
      position: JSON.parse(JSON.stringify(component.position)),
      scale: JSON.parse(JSON.stringify(component.scale))
    } as Transform
  case ComponentType.Image:
    return {
      type: ComponentType.Image,
      active: JSON.parse(JSON.stringify(component.active)),
      element: component.element,
      depth: JSON.parse(JSON.stringify(component.depth)),
      colors: JSON.parse(JSON.stringify(component.colors))
    } as Image
  }
  return null
}

export {
  copy,
  ComponentType,
  Component,
  Transform,
  Image
}
