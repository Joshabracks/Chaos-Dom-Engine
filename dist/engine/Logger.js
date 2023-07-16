const DEBUG_CONFIG = {
    ERROR: process.env.DEBUG,
    WARNING: process.env.DEBUG,
    LOG: process.env.DEBUG
};
const error = DEBUG_CONFIG.ERROR ? console.error : () => { };
const warning = DEBUG_CONFIG.WARNING ? console.warn : () => { };
const log = DEBUG_CONFIG.LOG ? console.log : () => { };
export { error, log, warning, };
