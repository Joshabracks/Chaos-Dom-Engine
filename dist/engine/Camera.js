import { getComponent } from './GameObject';
import { ComponentType } from './Component';
import { rectanglesIntersect } from './Math';
import { Viewport } from './Settings';
import APPLICATION from './Application';
let gameContainer;
let imageBucket;
function getCameraPosition(camera, pos) {
    return { x: pos.x - camera.position.x, y: pos.y - camera.position.y };
}
function isOnScreen(camera, gameObject) {
    const image = getComponent(gameObject, ComponentType.Image);
    const transform = getComponent(gameObject, ComponentType.Transform);
    if (image === null || transform === null)
        return false;
    const boundingBox = { width: image.element.width, height: image.element.height };
    const viewport = Viewport();
    const cameraBounds = {
        xMin: camera.position.x,
        xMax: camera.position.x + viewport.x,
        yMin: camera.position.y,
        yMax: camera.position.y + viewport.y
    };
    const imageBounds = {
        xMin: transform.position.x,
        xMax: transform.position.x + (typeof boundingBox.width === 'number' ? boundingBox.width : boundingBox.width.animVal.value),
        yMin: transform.position.y,
        yMax: transform.position.y + (typeof boundingBox.height === 'number' ? boundingBox.height : boundingBox.height.animVal.value)
    };
    return rectanglesIntersect(cameraBounds, imageBounds);
}
class Camera {
    constructor() {
        this.position = { x: 0, y: 0 };
    }
    render(object) {
        var _a;
        if (!gameContainer)
            gameContainer = document.querySelector('#game');
        if (!imageBucket)
            imageBucket = document.querySelector('#image-bucket');
        if (!object.active) {
            imageBucket.appendChild((_a = getComponent(object, ComponentType.Image)) === null || _a === void 0 ? void 0 : _a.element);
            return;
        }
        const image = getComponent(object, ComponentType.Image);
        if (!isOnScreen(this, object)) {
            if (image.element.parentElement !== imageBucket)
                imageBucket.appendChild(image.element);
            return;
        }
        const transform = getComponent(object, ComponentType.Transform);
        if (!transform || !image)
            return;
        if (image.element.parentElement !== gameContainer)
            gameContainer.appendChild(image.element);
        const onScreenPosition = getCameraPosition(this, transform.position);
        image.element.style.top = `${onScreenPosition.y * APPLICATION.SCALE}px`;
        image.element.style.left = `${onScreenPosition.x * APPLICATION.SCALE}px`;
    }
}
export default Camera;
