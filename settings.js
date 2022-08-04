const fs = require('fs');

const openSettings = () => {
    const settingsFile = fs.readFileSync('settings.json');
    return JSON.parse(settingsFile);
}

const settings = openSettings();

module.exports = {
    settings
};