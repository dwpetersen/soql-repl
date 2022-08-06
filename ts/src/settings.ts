import { readFileSync } from 'fs';

const openSettings = () => {
    const settingsFile = readFileSync('settings.json');
    return settingsFile.toJSON();
}

export const settings = openSettings();
