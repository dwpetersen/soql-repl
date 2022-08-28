import * as fs from 'fs';
import * as path from 'path';

export const CREDS_PATH = 'creds';

export interface Alias {
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

function getAliasPath(name: string) {
    return path.resolve(CREDS_PATH, `${name}.json`);
}

export function openAlias(name: string) {
    const aliasFile = fs.readFileSync(getAliasPath(name));
    const alias = JSON.parse(aliasFile.toString()) as Alias;
    alias.lastRequest = alias.lastRequest ? new Date(alias.lastRequest) : undefined;
    return alias;
} 

export function saveAlias(alias: Alias) {
    fs.writeFileSync(getAliasPath(alias.name), JSON.stringify(alias, null, 4));
}
