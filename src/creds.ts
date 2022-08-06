import * as fs from 'fs';

const CREDS_PATH = 'creds';

export const openAlias = (name) => {
    const aliasFile = fs.readFileSync(`${CREDS_PATH}/${name}.json`);
    const alias = JSON.parse(aliasFile.toString());
    alias.lastRequest = alias.lastRequest ? new Date(alias.lastRequest) : undefined;
    return alias;
} 

export const saveAlias = (alias) => {
    fs.writeFileSync(`${CREDS_PATH}/${alias.name}.json`, JSON.stringify(alias, null, 4));
};
