// import { error } from './Logger'
// import fs from 'fs'
// import path from 'path'
import { Vector2 } from './Math'

// SETTINGS File or Default Settings
interface SettingsConfiguration {
  [key: string]: string | number;
  'target-fps': number;
  'viewport-x': number;
  'viewport-y': number;
}
const SETTINGS: SettingsConfiguration = {
  'target-fps': 60,
  'viewport-x': 1920,
  'viewport-y': 1080,
}

/**
 * Updates SETTINGS target-fps value if value greater than 0 is provided and
 * returns SETTINGS target-fps value as number
 * @param fps: number
 * @returns number
 */
function TargetFps(fps = 0): number {
  if (fps <= 0) return SETTINGS['target-fps']
  SETTINGS['target-fps'] = fps
  return fps
}

/**
 * Updates SETTINGS viewport-x and viewport-y values if width or height values greater than 0 are passed
 * and returns SETTINGS viewport-x and viewport-y values as Vector2
 * @param viewportX: number
 * @param viewportY: number
 * @returns Vector2
 */
function Viewport(viewportX = -1, viewportY = -1): Vector2 {
  if (viewportX > 0) SETTINGS['viewport-x'] = viewportX
  if (viewportY > 0) SETTINGS['viewport-y'] = viewportY
  return { x: SETTINGS['viewport-x'], y: SETTINGS['viewport-y'] }
}

/**
 * Updates SETTINGS for values given that are greater than 0
 * and returns SETTINGS
 * @param targetFps number
 * @param viewportX number
 * @param viewportY number
 * @returns Settings
 */
function Settings(targetFps = -1, viewportX = -1, viewportY = -1): SettingsConfiguration {
  Viewport(viewportX, viewportY)
  TargetFps(targetFps)
  return SETTINGS
}

export { 
  Settings, 
  TargetFps, 
  Viewport 
}
