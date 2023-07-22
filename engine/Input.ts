import {Key} from './Keys'

enum KeyEvent {
  DOWN = 'keydown',
  UP = 'keyup',
  PRESSED = 'keypress'
}

interface KeyBinding {
  'code': any,
  'type': KeyEvent,
  action(event: any): any
}

interface InputEvent {
  'code': any,
  'type': KeyEvent,
  'data': any
}

const EVENTS: InputEvent[] = []
const pressed: {[key: string]: boolean} = {}
// eslint-disable-next-line @typescript-eslint/ban-types
const bindings: {[key: string]: Function} = {}
const bindingTypes: {[key: string]: string} = {}

/**
 * Checks for and runs input events
 */
function pollEvents() {
  EVENTS.sort((a) => a.type !== 'keyup' ? 1 : -1)
  // Run keyup/keydown events
  while (EVENTS.length) keyAction(EVENTS.pop() as InputEvent)
  // run keypressed events
  for ( const key in pressed ) {
    if (!bindings[key]) continue
    if (pressed[key] && bindingTypes[key] === KeyEvent.PRESSED) {
      bindings[key]?.()
    }
  }
}

/**
 * Checks to see if key has been pressed since last time events were polled
 * @param key 
 * @returns boolean
 */
function keyPressed(key: string): boolean {
  return pressed[key] ? true : false
}

/**
 * Adds KeyBinding for event polling
 * @param binding 
 */
function addKeyBinding(binding: KeyBinding){
  const key = getKey(binding)
  bindings[key] = binding.action
  bindingTypes[key] = binding.type
}

/**
 * Adds a callback function to handle mouse scroll event
 * @param callback 
 */
function addScrollEvent(callback: any) {
  window.addEventListener('mousewheel', callback)
}

/**
 * Binds a KeyEvent for polling to a given callback function via input event given
 * @param event 
 * @param type 
 * @param callback 
 * @returns boolean (success)
 */
function bindKey(event: KeyboardEvent, type: KeyEvent, callback: (event: KeyboardEvent) => void): boolean{
  if (event.code) {
    addKeyBinding({'code': event.code, 'action': callback, 'type': type})
    return true
  }
  return false
}

/**
 * Returns an event key code from given event
 * @param event 
 * @returns 
 */
function getKey(event: {code: string, type: string}): string {
  return event.code
}

/**
 * Checks event for action and runs approprite key binding if it exists
 * @param event 
 * @returns 
 */
function keyAction(event: InputEvent){
  if ((event.code !== 0 && !event.code) || !event.type) return
  if ([KeyEvent.DOWN as string, KeyEvent.UP as string, KeyEvent.PRESSED as string].indexOf(event.type) === -1) return
  const key = getKey(event)
  const runAction: boolean = (
    bindings[key] &&
    bindingTypes[key] == event.type &&
    (
      (event.type === KeyEvent.DOWN && !pressed[key]) ||
      (event.type === KeyEvent.UP)
    )) ? true : false
  switch(event.type) {
  case 'keydown':
    pressed[key] = true
    break
  case 'keyup':
    pressed[key] = false
  }
  if (runAction) bindings[key]?.(event)
}

/**
 * Adds event to polling queue
 * @param event 
 */
function pushEvent(event: any) {
  let type: KeyEvent
  if (event.type.match(/down/i)) type = KeyEvent.DOWN
  else if (event.type.match(/up/i)) type = KeyEvent.UP
  else return
  
  const inputEvent: InputEvent = {
    'code': event.code || event.button,
    'type': type,
    'data': event
  }
  EVENTS.push(inputEvent)
} 

function initInput() {
  const inputTypes = ['keydown', 'keyup', 'mousedown', 'mouseup']
  inputTypes.forEach(type => {window.addEventListener(type, pushEvent)})
}

export {
  KeyEvent,
  KeyBinding,
  keyPressed,
  addKeyBinding,
  bindKey,
  keyAction,
  pollEvents,
  initInput,
  Key,
  addScrollEvent
}