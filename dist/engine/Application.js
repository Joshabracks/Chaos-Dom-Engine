import { Settings } from './Settings';
const APPLICATION = {
    RUNNING: true,
    START: 0,
    PREVIOUS_TIME_STAMP: 0,
    TARGET_MS: 1000 / Settings()['target-fps'],
    SCALE: 1
};
export default APPLICATION;
