// import fs from 'fs'
import { error } from './Logger'

let IMAGE_ID_INDEX = 0

/**
 * Loads SVG from filepath or stringified XML data
 * @param SVGString 
 * @param colors Color values to replace specific variable markers left in string or file
 * @param scale 
 * @returns SVGSVGElement or null
 */
function loadSVG(SVGString: string, colors: {[key: string]: string} = {}, scale = 1): SVGSVGElement | null {
  let imageBucket = document.querySelector('#image-bucket')
  if (!imageBucket) {
    imageBucket = document.createElement('div')
    imageBucket.id = 'image-bucket'
    document.body.appendChild(imageBucket)
  }
  // let file = (fs.existsSync(SVGString) && fs.readFileSync(SVGString, 'utf-8'))
  let file = SVGString.match(/<svg[\s\S]+<\/svg>/) && SVGString || ''
  // if (!file) {
  // }
  if (!file) {
    error(`unable to find or parse file from ${SVGString}`)
    return null
  }
  if (colors) {
    for ( const key in colors) {
      const colorRegex = new RegExp(`{{${key}}}`, 'g')
      file = file.replace(colorRegex, colors[key] as string)
    }
  }

  imageBucket.innerHTML += file
  const svg = document.querySelector('#image-bucket svg:last-child')
  if (!svg) {
    error(`there was a problem adding svg from filepath: ${SVGString}`)
    return null
  }
  let width: number = parseInt(svg.getAttribute('width') as string)
  let height: number = parseInt(svg.getAttribute('height') as string)
  if (width) width = width * scale
  if (height) height = height * scale
  svg.setAttribute('width', `${width}`)
  svg.setAttribute('height', `${height}`)
  svg.setAttribute('original-width', `${width}`)
  svg.setAttribute('original-height', `${height}`)
  svg.setAttribute('image-id', `${IMAGE_ID_INDEX}`)
  svg.setAttribute('image-src', SVGString)
  IMAGE_ID_INDEX++
  imageBucket.appendChild(svg)
  return svg as SVGSVGElement
}

export { loadSVG }
