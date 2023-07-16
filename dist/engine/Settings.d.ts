import { Vector2 } from './Math';
interface SettingsConfiguration {
    [key: string]: string | number;
    'target-fps': number;
    'viewport-x': number;
    'viewport-y': number;
}
declare function TargetFps(fps?: number): number;
declare function Viewport(viewportX?: number, viewportY?: number): Vector2;
declare function Settings(targetFps?: number, viewportX?: number, viewportY?: number): SettingsConfiguration;
export { Settings, TargetFps, Viewport };
//# sourceMappingURL=Settings.d.ts.map