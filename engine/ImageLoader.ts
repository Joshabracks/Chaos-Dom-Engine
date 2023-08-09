let IMAGE_ID_INDEX = 0

/**
 * Loads SVG from filepath or stringified XML data
 * @param SVGString 
 * @param colors Color values to replace specific variable markers left in string or file
 * @param scale 
 * @returns Promise
*/
function loadSVG(SVGString: string, colors: {[key: string]: string} = {}, scale = 1): Promise<{ canvas: HTMLCanvasElement, context: CanvasRenderingContext2D }> {
  return new Promise((resolve, reject) => {

    // #image-bucket: Holds unrendered SVG 
    let imageBucket = document.querySelector('#image-bucket')
    if (!imageBucket) {
      imageBucket = document.createElement('div')
      imageBucket.id = 'image-bucket'
      document.body.appendChild(imageBucket)
    }
  
    let svgConfirmed = SVGString.match(/<svg[\s\S]+<\/svg>/) && SVGString || ''
    if (!svgConfirmed) {
      reject(`unable to find or parse svgConfirmed from ${SVGString}`)
      return
    }
    if (colors) {
      for ( const key in colors) {
        const colorRegex = new RegExp(`{{${key}}}`, 'g')
        svgConfirmed = svgConfirmed.replace(colorRegex, colors[key] as string)
      }
    }
  
    const svg = new Blob([svgConfirmed], {type: 'image/svg+xml'})
  
    const img = new Image()
    const url = window.URL.createObjectURL(svg)
    img.src = url
    const widthMatch = SVGString.match(/width=["']([\d.]+)/)
    const heightMatch = SVGString.match(/height=["']([\d.]+)/)
    let width = (parseFloat(widthMatch && widthMatch[1] || '0') || img.width) * scale
    let height = (parseFloat(heightMatch && heightMatch[1] || '0') || img.height) * scale
    if (width) width = width * scale
    if (height) height = height * scale
    img.setAttribute('width', `${width}`)
    img.setAttribute('height', `${height}`)
    img.setAttribute('original-width', `${width}`)
    img.setAttribute('original-height', `${height}`)
    img.setAttribute('image-id', `${IMAGE_ID_INDEX}`)
    img.setAttribute('image-src', SVGString)
    imageBucket.appendChild(img)
    IMAGE_ID_INDEX++
  
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
  
    img.onload = () => {
      context.drawImage(img, 0, 0)
      imageBucket.appendChild(canvas)
      resolve({context, canvas})
    }
  })
}

export { loadSVG }
