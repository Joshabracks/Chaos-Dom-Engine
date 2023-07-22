import fs from 'fs';
import { error } from './Logger';
var SAVE_JSON_CODE;
(function (SAVE_JSON_CODE) {
    SAVE_JSON_CODE[SAVE_JSON_CODE["SUCCESS"] = 0] = "SUCCESS";
    SAVE_JSON_CODE[SAVE_JSON_CODE["INVALID_PATH"] = 1] = "INVALID_PATH";
    SAVE_JSON_CODE[SAVE_JSON_CODE["FILE_EXISTS"] = 2] = "FILE_EXISTS";
    SAVE_JSON_CODE[SAVE_JSON_CODE["BAD_DATA"] = 3] = "BAD_DATA";
})(SAVE_JSON_CODE || (SAVE_JSON_CODE = {}));
function loadJSON(filepath) {
    if (!fs.existsSync(filepath))
        return { error: `Cannot file file: ${filepath}` };
    const file = fs.readFileSync(filepath, 'utf-8');
    try {
        return JSON.parse(file);
    }
    catch (e) {
        return { error: e };
    }
}
function saveJSON(folderPath, filename, data, override = false) {
    if (!fs.existsSync(folderPath)) {
        const dir = fs.mkdirSync(folderPath, { recursive: true });
        if (!dir)
            return SAVE_JSON_CODE.INVALID_PATH;
    }
    const path = `${folderPath}/${filename}`;
    if (fs.existsSync(path) && !override)
        SAVE_JSON_CODE.FILE_EXISTS;
    let stringifiedData;
    try {
        stringifiedData = JSON.stringify(data);
    }
    catch (e) {
        error(e, data);
        return SAVE_JSON_CODE.BAD_DATA;
    }
    fs.writeFileSync(path, stringifiedData, { flag: 'w', encoding: 'utf-8' });
    return SAVE_JSON_CODE.SUCCESS;
}
export { loadJSON, saveJSON, SAVE_JSON_CODE };
