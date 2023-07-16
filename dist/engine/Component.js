import { loadSVG } from './ImageLoader';
var ComponentType;
(function (ComponentType) {
    ComponentType["Transform"] = "transform";
    ComponentType["Image"] = "image";
})(ComponentType || (ComponentType = {}));
function copy(component) {
    switch (component.type) {
        case ComponentType.Transform:
            return {
                type: ComponentType.Transform,
                active: JSON.parse(JSON.stringify(component.active)),
                position: JSON.parse(JSON.stringify(component.position)),
                scale: JSON.parse(JSON.stringify(component.scale))
            };
        case ComponentType.Image:
            return {
                type: ComponentType.Image,
                active: JSON.parse(JSON.stringify(component.active)),
                element: loadSVG(component.element.getAttribute('image-src'), component.colors),
                depth: JSON.parse(JSON.stringify(component.depth)),
                colors: JSON.parse(JSON.stringify(component.colors))
            };
    }
    return null;
}
export { copy, ComponentType };
