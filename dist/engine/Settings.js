const SETTINGS = {
    'target-fps': 60,
    'viewport-x': 1920,
    'viewport-y': 1080,
};
function TargetFps(fps = 0) {
    if (fps <= 0)
        return SETTINGS['target-fps'];
    SETTINGS['target-fps'] = fps;
    return fps;
}
function Viewport(viewportX = -1, viewportY = -1) {
    if (viewportX > 0)
        SETTINGS['viewport-x'] = viewportX;
    if (viewportY > 0)
        SETTINGS['viewport-y'] = viewportY;
    return { x: SETTINGS['viewport-x'], y: SETTINGS['viewport-y'] };
}
function Settings(targetFps = -1, viewportX = -1, viewportY = -1) {
    Viewport(viewportX, viewportY);
    TargetFps(targetFps);
    return SETTINGS;
}
export { Settings, TargetFps, Viewport };
