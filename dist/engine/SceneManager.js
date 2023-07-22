import { error, warning } from './Logger';
import { newGameObjectFromFile, newGameObjectFromJSON } from './GameObject';
import Camera from './Camera';
import { loadJSON, saveJSON } from './file';
import { ComponentType } from './Component';
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
        const gameObject = newGameObjectFromJSON(object) || newGameObjectFromFile(object) || null;
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
function newSceneFromFile(filepath) {
    const file = loadJSON(filepath);
    if (file.error) {
        error(file.error);
        return -1;
    }
    const result = newSceneFromJSON(file);
    if (result === -1) {
        error(`Unable to load Scene from file ${filepath}`);
    }
    return result;
}
function loadScenesFromFile(filepath) {
    const file = loadJSON(filepath);
    if (file.error) {
        error(file.error);
    }
    file.forEach((sceneObject) => {
        newSceneFromJSON(sceneObject);
    });
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
function saveState(filepath, filename, override = false) {
    function serializeGameObject(object) {
        const serializer = new XMLSerializer();
        return {
            ...object,
            active: object.active,
            children: object.children.map(serializeGameObject),
            components: object.components.map(component => {
                switch (component.type) {
                    case ComponentType.Transform:
                        return component;
                    case ComponentType.Image:
                        return {
                            ...component,
                            type: component.type,
                            active: component.active,
                            depth: component.depth,
                            colors: component.colors,
                            element: serializer.serializeToString(component.element),
                        };
                    default:
                        return component;
                }
            }),
        };
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
            };
        })
    };
    return saveJSON(filepath, filename, result, override);
}
function loadState(filepath) {
    const file = loadJSON(filepath);
    if (!file.SCENES)
        return false;
    if (file.ACTIVE_SCENE)
        ACTIVE_SCENE = file.ACTIVE_SCENE;
    const gameContainer = document.querySelector('#game');
    if (gameContainer)
        gameContainer.innerHTML = '';
    const imagebucket = document.querySelector('#image-bucket');
    if (imagebucket)
        imagebucket.innerHTML = '';
    const loadedScenes = file.SCENES.map((scene) => {
        const camera = new Camera();
        camera.position = scene.camera.position;
        return {
            name: scene.name,
            objects: scene.objects.map(newGameObjectFromJSON),
            camera: camera
        };
    });
    while (SCENES.length)
        SCENES.pop();
    while (loadedScenes.length) {
        const scene = loadedScenes.shift();
        if (scene)
            SCENES.push(scene);
    }
    return true;
}
function getActiveScene() {
    return SCENES[ACTIVE_SCENE];
}
function getAllScenes() {
    return SCENES;
}
export { getAllScenes, loadScene, newSceneFromJSON, newSceneFromFile, loadScenesFromFile, newScene, getActiveScene, saveState, loadState };
