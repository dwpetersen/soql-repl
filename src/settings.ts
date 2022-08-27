import * as fs from 'fs';
import * as path from 'path';

const openSettings = () => {
    const settingsPath = path.resolve('config', 'settings.json');
    const settingsFile = fs.readFileSync(settingsPath);
    return JSON.parse(settingsFile.toString());
}

export const settings = openSettings();
