import { Key } from './Keys';
declare enum KeyEvent {
    DOWN = "keydown",
    UP = "keyup",
    PRESSED = "keypress"
}
interface KeyBinding {
    'code': any;
    'type': KeyEvent;
    action(event: any): any;
}
interface InputEvent {
    'code': any;
    'type': KeyEvent;
    'data': any;
}
declare function pollEvents(): void;
declare function keyPressed(key: string): boolean;
declare function addKeyBinding(binding: KeyBinding): void;
declare function addScrollEvent(callback: any): void;
declare function bindKey(event: KeyboardEvent, type: KeyEvent, callback: (event: KeyboardEvent) => void): boolean;
declare function keyAction(event: InputEvent): void;
declare function initInput(): void;
export { KeyEvent, KeyBinding, keyPressed, addKeyBinding, bindKey, keyAction, pollEvents, initInput, Key, addScrollEvent };
//# sourceMappingURL=Input.d.ts.map