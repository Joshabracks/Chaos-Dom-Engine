import { error, warning } from './Logger';
import { newGameObjectFromJSON } from './GameObject';
import Camera from './Camera';
let ACTIVE_SCENE = 0;
const SCENES = [];
function newScene(name = '') {
    if (!name) {
        name = `Untitled Scene ${SCENES.length}`;
    }
    const scene = {
        name: name,
        objects: [],
        camera: new Camera()
    };
    SCENES.push(scene);
    return SCENES.length - 1;
}
function newSceneFromJSON(json) {
    const errors = [];
    if (!json.name)
        errors.push('Scene is missing entry "name": string');
    if (!json.objects || !json.objects.length)
        errors.push('Scene is missing entry "objects": GameObject[]');
    if (errors.length) {
        error(`${errors.join('\n')}`);
        return -1;
    }
    const objects = [];
    json.objects.forEach((object) => {
        const gameObject = newGameObjectFromJSON(object) || null;
        if (gameObject !== null)
            objects.push(gameObject);
    });
    const camera = new Camera();
    if (json.camera && json.camera.position && json.camera.position.x && json.camera.position.y) {
        camera.position = { x: json.camera.position.x, y: json.camera.position.y };
    }
    const scene = {
        name: json.name,
        objects: objects,
        camera: camera
    };
    SCENES.push(scene);
    return SCENES.length - 1;
}
function loadScene(input) {
    switch (typeof input) {
        case 'number':
            if (SCENES[input]) {
                ACTIVE_SCENE = input;
                return true;
            }
            break;
        case 'string':
            {
                const length = SCENES.length;
                for (let i = 0; i < length; i++) {
                    const scene = SCENES[i];
                    if (scene && scene.name === input) {
                        ACTIVE_SCENE = i;
                        return true;
                    }
                }
            }
            break;
        default:
            break;
    }
    warning(`Unable to find scene ${typeof input === 'string' ? 'with name' : 'at index'} ${input}`);
    return false;
}
function getActiveScene() {
    return SCENES[ACTIVE_SCENE];
}
function getAllScenes() {
    return SCENES;
}
export { getAllScenes, loadScene, newSceneFromJSON, newScene, getActiveScene, };
