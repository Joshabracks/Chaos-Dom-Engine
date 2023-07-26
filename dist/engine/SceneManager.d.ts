import { GameObject } from './GameObject';
import Camera from './Camera';
interface Scene {
    name: string;
    objects: GameObject[];
    camera: Camera;
}
declare function newScene(name?: string): number;
declare function newSceneFromJSON(json: any): number;
declare function loadScene(index: number): boolean;
declare function loadScene(name: string): boolean;
declare function getActiveScene(): Scene | undefined;
declare function getAllScenes(): Scene[];
export { Scene, getAllScenes, loadScene, newSceneFromJSON, newScene, getActiveScene, };
//# sourceMappingURL=SceneManager.d.ts.map