import * as creds from '../creds';
import { Alias, OAuthAlias, PasswordAlias } from '../creds';
import * as oauth from './oauth';
import * as password from './password';

const TOKEN_TIMEOUT_MINS = 60;

async function getAccessToken(alias: Alias) {
    if (creds.isOAuthAlias(alias)) {
        const oauthAlias = alias as OAuthAlias;
        return await oauth.getAccessToken(oauthAlias);
    }
    else if (creds.isPasswordAlias(alias)) {
        const passwordAlias = alias as PasswordAlias;
        return await password.getAccessToken(passwordAlias);
    }
    else {
        throw new TypeError('Alias type not supported.');
    }
}

function isTokenExpired(alias: Alias) {
    return !alias.lastRequest || 
           Date.now() - alias.lastRequest.getTime() > (1000*60*TOKEN_TIMEOUT_MINS);
}

export async function checkCurrentToken(alias: Alias) {
    let validToken = true;
    if (!alias.currentToken) {
        console.log(`Could not find currentToken for alias '${alias.name}'.`);
        validToken = false;
    }
    else if (isTokenExpired(alias)) {
        console.log(`Token has expired for alias '${alias.name}'.`);
        validToken = false;
    }
    if (!validToken) {
        console.log(`Setting currentToken...`);
        const token = await getAccessToken(alias);
        alias.currentToken = token;
        alias.lastRequest = new Date();
        creds.saveAlias(alias);       
    }
}