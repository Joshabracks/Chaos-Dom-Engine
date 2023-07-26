import { error } from './Logger';
let IMAGE_ID_INDEX = 0;
function loadSVG(SVGString, colors = {}, scale = 1) {
    let imageBucket = document.querySelector('#image-bucket');
    if (!imageBucket) {
        imageBucket = document.createElement('div');
        imageBucket.id = 'image-bucket';
        document.body.appendChild(imageBucket);
    }
    let file = SVGString.match(/<svg[\s\S]+<\/svg>/) && SVGString || '';
    if (!file) {
        error(`unable to find or parse file from ${SVGString}`);
        return null;
    }
    if (colors) {
        for (const key in colors) {
            const colorRegex = new RegExp(`{{${key}}}`, 'g');
            file = file.replace(colorRegex, colors[key]);
        }
    }
    imageBucket.innerHTML += file;
    const svg = document.querySelector('#image-bucket svg:last-child');
    if (!svg) {
        error(`there was a problem adding svg from filepath: ${SVGString}`);
        return null;
    }
    let width = parseInt(svg.getAttribute('width'));
    let height = parseInt(svg.getAttribute('height'));
    if (width)
        width = width * scale;
    if (height)
        height = height * scale;
    svg.setAttribute('width', `${width}`);
    svg.setAttribute('height', `${height}`);
    svg.setAttribute('original-width', `${width}`);
    svg.setAttribute('original-height', `${height}`);
    svg.setAttribute('image-id', `${IMAGE_ID_INDEX}`);
    svg.setAttribute('image-src', SVGString);
    IMAGE_ID_INDEX++;
    imageBucket.appendChild(svg);
    return svg;
}
export { loadSVG };
