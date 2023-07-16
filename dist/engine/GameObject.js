import * as Component from './Component';
import { loadJSON } from './file';
import { error } from './Logger';
import { loadSVG } from './ImageLoader';
function newGameObjectFromJSON(json) {
    if (typeof json !== 'object')
        return null;
    const components = [];
    json.components.forEach((component) => {
        switch (component.type) {
            case Component.ComponentType.Image:
                const element = loadSVG(component.element, component.colors);
                if (element) {
                    const image = {
                        type: Component.ComponentType.Image,
                        active: component.active,
                        element: element,
                        depth: component.depth,
                        colors: component.colors
                    };
                    components.push(image);
                }
                break;
            case Component.ComponentType.Transform:
                const transform = {
                    type: Component.ComponentType.Transform,
                    active: component.active,
                    position: { x: component.position.x, y: component.position.y },
                    scale: { x: component.scale.x, y: component.scale.y },
                };
                components.push(transform);
                break;
        }
    });
    const children = [];
    if (json.children) {
        json.children.forEach((childFilePath) => {
            const child = newGameObjectFromFile(childFilePath);
            if (child)
                children.push(child);
        });
    }
    return {
        active: json.active,
        children: children,
        components: components,
    };
}
function newGameObjectFromFile(filepath) {
    const file = loadJSON(filepath);
    if (file.error) {
        error(file.error);
        return null;
    }
    return newGameObjectFromJSON(file);
}
function getComponent(gameObject, type) {
    let i = 0;
    while (i < gameObject.components.length) {
        if (gameObject.components[i].type === type)
            return gameObject.components[i];
        i++;
    }
    return null;
}
function getComponentIndex(gameObject, type) {
    let i = 0;
    while (i < gameObject.components.length) {
        if (gameObject.components[i].type === type)
            return i;
        i++;
    }
    return -1;
}
function copy(gameObject) {
    const object = {
        'active': gameObject.active,
        'children': [],
        'components': []
    };
    gameObject.children.forEach(child => object.children.push(copy(child)));
    gameObject.components.forEach(component => object.components.push(Component.copy(component)));
    return object;
}
export { copy, newGameObjectFromFile, newGameObjectFromJSON, getComponent, getComponentIndex };
