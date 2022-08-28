import * as fs from 'fs';
import * as path from 'path';

export interface Settings {
    defaultAlias: string
}

function openSettings(): Settings {
    const settingsPath = path.resolve('config', 'settings.json');
    const settingsFile = fs.readFileSync(settingsPath);
    return JSON.parse(settingsFile.toString()) as Settings;
}

export const settings = openSettings();
