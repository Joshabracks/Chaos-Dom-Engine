import Application from './Application';
import Camera from './Camera';
import * as Component from './Component';
import * as Debug from './Logger';
import * as GameObject from './GameObject';
import * as Math from './Math';
import * as Imageloader from './ImageLoader';
import * as Input from './Input';
import * as Render from './Render';
import * as Resize from './Resize';
import * as SceneManager from './SceneManager';
import * as Settings from './Settings';
function initAll() {
    if (!document.querySelector('#game')) {
        const gameContainer = document.createElement('div');
        gameContainer.id = 'game';
        document.body.appendChild(gameContainer);
    }
    Input.initInput();
    Resize.initResize();
}
export { Application, Camera, Component, Debug, GameObject, Math, Imageloader, Input, Render, Resize, SceneManager, Settings, initAll };
