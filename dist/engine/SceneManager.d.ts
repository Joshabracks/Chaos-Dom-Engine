import { GameObject } from './GameObject';
import Camera from './Camera';
import { SAVE_JSON_CODE } from './file';
interface Scene {
    name: string;
    objects: GameObject[];
    camera: Camera;
}
declare function newScene(name?: string): number;
declare function newSceneFromJSON(json: any): number;
declare function newSceneFromFile(filepath: string): number;
declare function loadScenesFromFile(filepath: string): void;
declare function loadScene(index: number): boolean;
declare function loadScene(name: string): boolean;
declare function saveState(filepath: string, filename: string, override?: boolean): SAVE_JSON_CODE;
declare function loadState(filepath: string): boolean;
declare function getActiveScene(): Scene | undefined;
declare function getAllScenes(): Scene[];
export { Scene, getAllScenes, loadScene, newSceneFromJSON, newSceneFromFile, loadScenesFromFile, newScene, getActiveScene, saveState, loadState };
//# sourceMappingURL=SceneManager.d.ts.map