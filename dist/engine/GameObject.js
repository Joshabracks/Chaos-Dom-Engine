import * as Component from './Component';
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
        json.children.forEach((childData) => {
            const child = newGameObjectFromJSON(childData);
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
function getComponent(gameObject, type) {
    var _a;
    let i = 0;
    while (i < gameObject.components.length) {
        if (((_a = gameObject.components[i]) === null || _a === void 0 ? void 0 : _a.type) === type)
            return gameObject.components[i];
        i++;
    }
    return null;
}
function getComponentIndex(gameObject, type) {
    var _a;
    let i = 0;
    while (i < gameObject.components.length) {
        if (((_a = gameObject.components[i]) === null || _a === void 0 ? void 0 : _a.type) === type)
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
export { copy, newGameObjectFromJSON, getComponent, getComponentIndex };
