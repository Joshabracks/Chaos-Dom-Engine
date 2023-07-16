import { Vector2 } from './Math';
declare enum ComponentType {
    Transform = "transform",
    Image = "image"
}
interface Component {
    [x: string]: any;
    active: boolean;
    type: ComponentType;
}
interface Transform extends Component {
    type: ComponentType.Transform;
    position: Vector2;
    scale: Vector2;
}
interface Image extends Component {
    type: ComponentType.Image;
    element: HTMLImageElement | SVGSVGElement;
    depth: number;
    colors: {
        [key: string]: string;
    };
}
declare function copy(component: any): any;
export { copy, ComponentType, Component, Transform, Image };
//# sourceMappingURL=Component.d.ts.map