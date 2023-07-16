import { Key } from './Keys';
var KeyEvent;
(function (KeyEvent) {
    KeyEvent["DOWN"] = "keydown";
    KeyEvent["UP"] = "keyup";
    KeyEvent["PRESSED"] = "keypress";
})(KeyEvent || (KeyEvent = {}));
const EVENTS = [];
const pressed = {};
const bindings = {};
const bindingTypes = {};
function pollEvents() {
    EVENTS.sort((a) => a.type !== 'keyup' ? 1 : -1);
    while (EVENTS.length)
        keyAction(EVENTS.pop());
    for (const key in pressed) {
        if (!bindings[key])
            continue;
        if (pressed[key] && bindingTypes[key] === KeyEvent.PRESSED) {
            bindings[key]();
        }
    }
}
function keyPressed(key) {
    return pressed[key];
}
function addKeyBinding(binding) {
    const key = getKey(binding);
    bindings[key] = binding.action;
    bindingTypes[key] = binding.type;
}
function addScrollEvent(callback) {
    window.addEventListener('mousewheel', callback);
}
function bindKey(event, type, callback) {
    if (event.code) {
        addKeyBinding({ 'code': event.code, 'action': callback, 'type': type });
        return true;
    }
    return false;
}
function getKey(event) {
    return event.code;
}
function keyAction(event) {
    if ((event.code !== 0 && !event.code) || !event.type)
        return;
    if ([KeyEvent.DOWN, KeyEvent.UP, KeyEvent.PRESSED].indexOf(event.type) === -1)
        return;
    const key = getKey(event);
    const runAction = (bindings[key] &&
        bindingTypes[key] == event.type &&
        ((event.type === KeyEvent.DOWN && !pressed[key]) ||
            (event.type === KeyEvent.UP)));
    switch (event.type) {
        case 'keydown':
            pressed[key] = true;
            break;
        case 'keyup':
            pressed[key] = false;
    }
    if (runAction)
        bindings[key](event);
}
function pushEvent(event) {
    let type;
    if (event.type.match(/down/i))
        type = KeyEvent.DOWN;
    else if (event.type.match(/up/i))
        type = KeyEvent.UP;
    const inputEvent = {
        'code': event.code || event.button,
        'type': type,
        'data': event
    };
    EVENTS.push(inputEvent);
}
function initInput() {
    const inputTypes = ['keydown', 'keyup', 'mousedown', 'mouseup'];
    inputTypes.forEach(type => { window.addEventListener(type, pushEvent); });
}
export { KeyEvent, keyPressed, addKeyBinding, bindKey, keyAction, pollEvents, initInput, Key, addScrollEvent };
