declare function loadJSON(filepath: string): any;
declare enum SAVE_JSON_CODE {
    SUCCESS = 0,
    INVALID_PATH = 1,
    FILE_EXISTS = 2,
    BAD_DATA = 3
}
declare function saveJSON(folderPath: string, filename: string, data: any, override?: boolean): SAVE_JSON_CODE;
export { loadJSON, saveJSON, SAVE_JSON_CODE };
//# sourceMappingURL=file.d.ts.map