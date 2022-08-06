import * as fs from 'fs';

const openSettings = () => {
    const settingsFile = fs.readFileSync('settings.json');
    return JSON.parse(settingsFile.toString());
}

export const settings = openSettings();
