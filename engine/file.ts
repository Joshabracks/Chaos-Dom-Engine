import fs from 'fs'
import { error } from './Logger'

/**
 * Loads and returns utf-8 formatted JSON file
 * @param filepath string: Exact path to file to be loaded
 * @returns any
 */
function loadJSON(filepath: string) {
  if (!fs.existsSync(filepath)) return { error: `Cannot file file: ${filepath}`}
  const file = fs.readFileSync(filepath, 'utf-8')
  try {
    return JSON.parse(file)
  } catch (e) {
    return { error: e }
  }
}

enum SAVE_JSON_CODE {
  SUCCESS,
  INVALID_PATH,
  FILE_EXISTS,
  BAD_DATA
}

/**
 * Saves object as utf-8 formatted JSON file
 * @param folderPath string: Exact path to folder where JSON is to be saved
 * @param filename string: Name of file where JSON is to be saved
 * @param data any
 * @param override boolean: will overwrite file if set to true 
 * @returns SAVE_JSON_CODE
 */
function saveJSON(folderPath: string, filename: string, data: any, override = false): SAVE_JSON_CODE {
  if (!fs.existsSync(folderPath)) {
    const dir = fs.mkdirSync(folderPath, { recursive: true })
    if (!dir) return SAVE_JSON_CODE.INVALID_PATH
  }
  const path = `${folderPath}/${filename}`
  if (fs.existsSync(path) && !override) SAVE_JSON_CODE.FILE_EXISTS
  let stringifiedData
  try {
    stringifiedData = JSON.stringify(data)
  } catch (e) {
    error(e, data)
    return SAVE_JSON_CODE.BAD_DATA
  }
  
  // console.log(new TextEncoder().encode(stringifiedData))
  fs.writeFileSync(path, stringifiedData, { flag: 'w', encoding: 'utf-8' })
  return SAVE_JSON_CODE.SUCCESS
}

export { loadJSON, saveJSON, SAVE_JSON_CODE }