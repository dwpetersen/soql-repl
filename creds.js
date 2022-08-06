const fs = require('fs');

const CREDS_PATH = 'creds';

const openAlias = (name) => {
    const aliasFile = fs.readFileSync(`${CREDS_PATH}/${name}.json`);
    const alias = JSON.parse(aliasFile);
    alias.lastRequest = alias.lastRequest ? new Date(alias.lastRequest) : undefined;
    return alias;
} 

const saveAlias = (alias) => {
    fs.writeFileSync(`${CREDS_PATH}/${alias.name}.json`, JSON.stringify(alias, null, 4));
};

module.exports = {
    openAlias,
    saveAlias
};
