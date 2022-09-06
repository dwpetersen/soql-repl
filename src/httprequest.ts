import { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';
import { Alias, OAuthAlias, PasswordAlias } from './creds';
import * as creds from './creds';
import * as open from 'open';
import * as express from 'express';
import { Express, Request, Response } from 'express';

const TOKEN_TIMEOUT_MINS = 60;

type AxiosGetParams = Parameters<typeof axios.get>;

interface TokenResponseData {
    access_token: string;
}

function getDefaultHeaders(alias: Alias) {
    return {
        'Authorization': `Bearer ${alias.currentToken}`,
        'Accept': 'application/json'
    }
}

function buildAuthFormData(alias: OAuthAlias) {
    const data = {
        response_type: 'code',
        client_id: alias.clientId,
        client_secret: alias.clientSecret,
        login_hint: alias.username,
        redirect_uri: 'http://localhost:3000/oauth2/callback',
    }

    const formData = Object.entries(data).map(entry => {
        return encodeURI(entry[0]) + '=' + encodeURI(entry[1]);
    }).join('&');

    return formData;
}

function buildTokenFromPasswordFormData(alias: PasswordAlias) {
    const data = {
        grant_type: 'password',
        client_id: alias.clientId,
        client_secret: alias.clientSecret,
        username: alias.username,
        password: alias.password + alias.securityToken
    }

    const formData = Object.entries(data).map(entry => {
        return encodeURI(entry[0]) + '=' + encodeURI(entry[1]);
    }).join('&');

    return formData;
}

function buildTokenFromCodeFormData(alias: OAuthAlias, code: string) {
    const data = {
        grant_type: 'authorization_code',
        client_id: alias.clientId,
        client_secret: alias.clientSecret,
        code: code,
        redirect_uri: alias.redirectURI
    }

    const formData = Object.entries(data).map(entry => {
        return encodeURI(entry[0]) + '=' + encodeURI(entry[1]);
    }).join('&');

    return formData;
}

async function retry<T,P extends unknown[]>(request: (...args: [...P]) => Promise<T>,
                        params: P,
                        retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await request(...params);
            return response;
        }
        catch (err) {
            if (err && typeof err === 'object' && 'response' in err) {
                throw err as AxiosError;
            }
        }
    }

    throw new Error(`Could not complete request. Maximum retries reached (${retries}).`);
}

export async function get<T = never>(alias: Alias, path: string, headers?: object): Promise<AxiosResponse<T>> {
    const defaultHeaders = getDefaultHeaders(alias);
    const config = {
        baseURL: alias.url,
        headers: { ...defaultHeaders, ...headers }
    }

    const params: AxiosGetParams = [path, config];
    const wrappedAxiosGet = (...args: AxiosGetParams) => {
        return axios.get<T>(...args);
    };

    await checkCurrentToken(alias);
    const response = await retry(wrappedAxiosGet, params);
    alias.lastRequest = new Date();
    creds.saveAlias(alias);
    return response;
}

export function getAccessTokenWithOAuth(alias: OAuthAlias) {
    let url =  alias.url + '/services/oauth2/authorize?';
    url += buildAuthFormData(alias);
    
    const app: Express = express();
    const port = 3000;

    return new Promise<string>((resolve, reject) => {
        app.get('/oauth2/callback', (req: Request, res: Response) => {
            const code = req.query.code as string;
            console.log('code: ' + code);
    
            getAccessTokenWithCode(alias, code)
                .then(token => {
                    console.log('accessToken: ' + token);
                    res.send('Access token has been set. You can now close this page');
                    resolve(token);
                })
                .catch(err => {
                    const errorReceived = err as AxiosError;
                    res.status(500);
                    res.send({
                        error: errorReceived.message,
                        response: errorReceived.response?.data
                    })
                    reject(err);
                })
                .finally(() =>{
                    server.close();
                });
        });
    
        const server = app.listen(port);
        open(url).catch(reject);
    });
}

async function getAccessTokenWithPassword(alias: PasswordAlias) {
    const url = 'https://login.salesforce.com/services/oauth2/token';
    const data = buildTokenFromPasswordFormData(alias);

    const response: AxiosResponse<TokenResponseData> = await axios.post(url, data);
    return response.data.access_token;
}

async function getAccessTokenWithCode(alias: OAuthAlias, code: string) {
    const url = 'https://login.salesforce.com/services/oauth2/token';
    const data = buildTokenFromCodeFormData(alias, code);

    const response: AxiosResponse<TokenResponseData> = await axios.post(url, data);
    return response.data.access_token;
}

async function getAccessToken(alias: Alias) {
    if (creds.isOAuthAlias(alias)) {
        const oauthAlias = alias as OAuthAlias;
        return await getAccessTokenWithOAuth(oauthAlias);
    }
    else if (creds.isPasswordAlias(alias)) {
        const passwordAlias = alias as PasswordAlias;
        return await getAccessTokenWithPassword(passwordAlias);
    }
    else {
        throw new TypeError('Alias type not supported.');
    }
}

function isTokenExpired(alias: Alias) {
    return !alias.lastRequest || 
           Date.now() - alias.lastRequest.getTime() > (1000*60*TOKEN_TIMEOUT_MINS);
}

async function checkCurrentToken(alias: Alias) {
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
