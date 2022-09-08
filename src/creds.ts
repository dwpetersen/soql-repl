import * as fs from 'fs';
import * as path from 'path';
import * as utils from './utils'

export const CREDS_PATH = 'creds';

interface BaseAlias {
    name: string;
    url: string;
    clientId: string;
    clientSecret: string;
    username: string;
    currentToken?: string;
    lastRequest?: Date;
}

function isBaseAlias(value: unknown) {
    const alias = value as BaseAlias;
    const properties = ['name', 'url',
                        'clientId', 'clientSecret',
                        'username'];
    return utils.type.hasProperties(alias, properties);
}

export interface PasswordAlias extends BaseAlias {
    password: string;
    securityToken: string;
}

export function isPasswordAlias(value: unknown) {
    const alias = value as PasswordAlias;
    if(!isBaseAlias(alias)) {
        return false;
    }
    else {
        const properties = ['password', 'securityToken'];
        return utils.type.hasProperties(alias, properties)
    }
}

export interface OAuthAlias extends BaseAlias {
    redirectURI: string;
}

export function isOAuthAlias(value: unknown) {
    const alias = value as OAuthAlias;
    if(!isBaseAlias(alias)) {
        return false;
    }
    else {
        const properties = ['redirectURI'];
        return utils.type.hasProperties(alias, properties)
    }
}

export type Alias = OAuthAlias|PasswordAlias;

export function isAlias(value: unknown) {
    return isOAuthAlias(value) || isPasswordAlias(value);
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
