import * as Component from './Component';
interface GameObject {
    active: boolean;
    components: Component.Component[];
    children: GameObject[];
    init?(props: any): any;
}
declare function newGameObjectFromJSON(json: any): GameObject | null;
declare function newGameObjectFromFile(filepath: string): GameObject | null;
declare function getComponent(gameObject: GameObject, type: Component.ComponentType): Component.Component | Component.Transform | Component.Image | null;
declare function getComponentIndex(gameObject: GameObject, type: Component.ComponentType): number;
declare function copy(gameObject: GameObject): GameObject;
export { copy, GameObject, newGameObjectFromFile, newGameObjectFromJSON, getComponent, getComponentIndex };
//# sourceMappingURL=GameObject.d.ts.map