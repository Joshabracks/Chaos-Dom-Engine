# CHAOS DOM ENGINE (CDE)
An open-source game development library that runs entirely on the DOM.

## FAQ
### But the DOM is so slow and games are meant to be FAST!!!
Well... Not all games need to super fast.  I want to make a 2D game made up entirely of Vector Graphics and, unless I felt like developing an entirely new kind of graphics rendering engine, HTML5 does it best with SVGs. (as far as I know).   HTML/CSS is also great for creating fast and fancy looking User Interfaces AND, SVGs being a living part of the DOM means that you can easily edit them via CSS as well.

### Why create it as a node package?
The game I'm working on is meant to be highly mod-able, so having access to a fast and reliable file system is paramount.  Despite the game being run on the DOM, I do not intend to make it into a browser game and am instead running it via Electron.  Node is also a great platform for distribution of open-source projects.

### Do you plan on releasing a web-friendly version?
Probably.  I (or someone who wants to contribute) will just need to remove all path/fs capabilities from the engine.  In which case, any elements must already exist on the DOM or as stringified versions of themselve in some JavaScript files (or something of the like)

### Why doesn't the "engine" support raster graphics like .jpeg or .png
The game I'm developing doesn't use any raster graphics, so I haven't had any reason to add them to the "engine".

## Documentation
### Quick Start Guide
In its current state, CDE will not run in a browser, so you're going to need to set up a node-friendly desktop app.  I'm using Electron, but I also like Neutralinojs.
* [Electron](https://www.electronjs.org)
* [Neutralinojs](https://neutralino.js.org/)

Once your desktop framework is set up, you should be able to start working on your game.  Here's a quick snippet to get an SVG to render on-screen.  

First, you'll need to add `chaos-dom-engine` to your npm project.

```
npm i chaos-dom-engine
```

Your index.html file should look like this
./index.html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'">
    <title>Your Game Title Here</title>
    <link rel="stylesheet" href="./static/styles.css">
  </head>
  <body>
    <script src="./build/renderer.js"></script>
  </body>
</html>
```
Add a CSS file at `./static/style.css`.  This will handle some of the elements that will be injected into your game.  You can also use this file to style your UI and add reactive actions like hover to your in-game SVG elements.

./static/style.css
```css
body {
  overflow: hidden;
}

svg {
  overflow: visible;
}

#image-bucket {
  position: absolute;
  top: 100%;
  display: none;
}

#game {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
```

Then we can start coding.  In an electron app, this should be in your renderer.js file

./renderer.js
```javascript
import {SceneManager, Component, ImageLoader, initAll, Render} from 'chaos-dom-engine'

// For the sake of simplicity, we're going to load our svg as a string
// Note that the fill attributes are marked with double curly brackets {{}}.  This is to denote that they are variables to be replaced.
const SVG_STRING = `
<svg version="1.1" id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100px" height="75px" viewBox="0 0 100 75" xml:space="preserve">
    <polygon class="tile top overlap-hover" pointer-events="all" fill="{{top}}" points="0,25 50,0 100,25 50,50 "/>
    <polygon class="tile side a" fill="{{side_a}}" points="50,50 100,25 100,50 50,75 "/>
    <polygon class="tile side b" fill="{{side_b}}" points="50,50 0,25 0,50 50,75 "/>
</svg>
`

// Create an empty scene
SceneManager.newScene('Test Scene')
// Assign the active scene
const ACTIVE_SCENE = SceneManager.getActiveScene()
// Create a new GameObject
const gameObject = {
  active: true,
  components: [
    {
      type: Component.ComponentType.Transform,
      active: true,
      position: { x: 500, y: 500 },
      scale: { x: 1, y: 1 }
    },
    {
      type: Component.ComponentType.Image,
      active: true,
      element: ImageLoader.loadSVG(
        SVG_STRING,
        // colors: this will replace the open variables in the SVG_STRING with the designated colors
        { top: 'red', side_a: 'blue', side_b: 'green' }
      ),
      depth: 1
    }
  ],
  children: []
}

// Add the game object to the scene
ACTIVE_SCENE.objects.push(gameObject)

// Initialize CDE and begin game render loop
window.onload = () => {
  initAll()
  Render.renderLoop()
}
```

Next time you run your game, the following image should render on screen

![01.png](01.png)

## API

### Application
Constants used throughout the application  
`Running` [boolean]: Signals if application render loop should continue.  If set to false, the Application window will close  
`START` [number]: Timestamp signifying when the application started running  
`PREVIOUS_TIME_STAMP` [number]: Timestamp used to determine time of last frame render  
`TARGET_MS` [number]: The approximate number of miliseconds between render frames  
`SCALE` [number]: Determines the size images in the game should render at

### Camera
`Camera` [class]: Determines the frame bounds for rendering in-game objects  
  - `position` [Vector2]: determines x/y coordinates of the camera

### Component
`ComponentType` [enum]: Used to mark a component's type  
  - `Transform` [string]: 'transform'  
  - `Image` [string]: 'image'
---
`Component` [Object]: Data object used to customize functionality of a GameObject  
  - `active` [boolean]: Determines if component should be considered during render loop  
  - `type` [ComponentType]: Denotes the desired functionality of the component
---
`Transform` [Component]: Holds position, size and other transformative data to be applied to the GameObject  
  - `type` [ComponentType] = `ComponentType.Transform`  
  - `position` [Vector2]: Position of the game object within the game world.  
  - `scale` [Vector2]: Sets the horizontal (x) and vertical (y) scaling of the GameObject.  This will also effect Image Components attached to the Game Object
---
`Image` [Component]: Image (Currently only SVG) attached to the GameObject  
 - `type` [ComponentType] = `ComponentType.Image`  
 - `element` [ `HTMLImageElement` | `SVGSVGElement` ]: visual DOM component attached to the GameObject.  Can be set to a filepath string when defined inside of a JSON GameObject or Scene file  
 - `depth` [number]: Render depth of the element  
 - `colors` [dictionary`<`string`:`string`>]: Colors to replace variables outlined witin the SVG string upon initial render.
---
`copy` [function] -> any: Makes a deep copy of given component and returns the copy
  - `component` [any]: Component to be copied.  (technically works with any give object)

### GameObject
`GameObject`[Object]: Data object used to denote in-game objects.  
  - `active`[boolean]: Determines whether or not object will be addressed during the renderLoop  
  - `components`[Array<component>]: Determine the behavior of the the GameObject  
  - `children`[Array<GameObject>]: Other game objects that are effected by the parent GameObject's Transform Component or other propagating Components
---
`newGameObjectFromJSON`[function] -> GameObject: Creates a new GameObject from given parameters
  - `json`[any]: Set of props used to craft the new GameObject.
---
 `newGameObjectFromFile`[function] -> GameObject: Creates a new GameObject read from JSON file with appropriate parameters
  - `filepath`[string]: full path to file with GameObject information
---
`getComponent`[function] -> Component: Gets component of the the Given type from the given GameObject  
  - `gameObject`[GameObject]: GameObject to query for component  
  - `type`[ComponentType]: ComponentType to look for
---
`getComponentIndex`[function] -> number: Queries a GameObject for given component type and returns the component's index
  - `gameObject`[GameObject]: Game objec to query for component index  
  - `type`[ComponentType]: ComponentType to look for
---
`copy`[function] -> GameObject: Makes and returns a deep copy of a gameObject
  -  `gameObject`[GameObject]: GameObject to make copy of

## ImageLoader
`loadSVG`[function] -> SVGSVGElement: Loads SVG element onto DOM via file or stringified SVG  
  -  `filePathOrSVGString`[string]: Filepath to SVG file or stringified SVG to load into DOM  
  -  `colors`[dictionary<string: string>]: Color codes by variable key to replace double bracket variables `{{variable_name}}` within given SVG code.

## Input
`KeyEvent`[enum]  
  - `DOWN`[string] = keydown  
  - `UP`[string] = keyup  
  - `PRESSED`[string] = keypress  
---
`KeyBinding` [interface]: Object used to configure and bind functions to key events
  - `code` [any]: key code, usually number or string, to be bound. (See Keys)
  - `type` [KeyEvent]: KeyEvent to query
  - `action` [function]: Function to bind
---
`InputEvent` [interface]: Event parameters polled each render cycle to run events
  - `code` [any]: key code, usually number or string, to e bound (See Keys)
  - `type` [KeyEvent]: KeyEvent to query
  - `data` [any]: Window.event object
---
`addKeyBinding` [function] --> void: Uses KeyBinding interface to bind a key event to a function
  - `binding` [KeyBinding]: KeyBinding to process
---
`bindKey` [function] --> boolean: Constructs a KeyBinding and reports if key was successfully bound
  - `event` [KeyboardEvent]: Window generated event
  - `type` [KeyEvent]: Type of keypress to trigger function
  - `callback` [function]: Callback function to be used when event is triggered
---
`getKey` [function] --> string: Retrives code from Window generated event
  - `event` [InputEvent]: Window generated input event
