import * as fs from 'fs';

const CREDS_PATH = 'creds';

export type Alias = {
    name: string;
    url: string;
    clientId: string;
    clientSecret: string;
    username: string;
    password: string;
    securityToken: string;
    currentToken: string;
    lastRequest?: Date;
}

export const openAlias = (name: string) => {
    const aliasFile = fs.readFileSync(`${CREDS_PATH}/${name}.json`);
    const alias: Alias = JSON.parse(aliasFile.toString());
    alias.lastRequest = alias.lastRequest ? new Date(alias.lastRequest) : undefined;
    return alias;
} 

export const saveAlias = (alias: Alias) => {
    fs.writeFileSync(`${CREDS_PATH}/${alias.name}.json`, JSON.stringify(alias, null, 4));
};
