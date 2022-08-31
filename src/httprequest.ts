import { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';
import { Alias } from './creds';
import * as creds from './creds';
import * as open from 'open';

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

function buildAuthFormData(alias: Alias) {
    const data = {
        response_type: 'token',
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

function buildTokenFormData(alias: Alias) {
    const data = {
        grant_type: 'password',
        client_id: alias.clientId,
        client_secret: alias.clientSecret,
        username: alias.username,
        password: alias.password + alias.securityToken
    }

    Object.entries

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

export async function authorizeApplication(alias: Alias) {
    let url = 'https://login.salesforce.com/services/oauth2/authorize?';
    url += buildAuthFormData(alias);
    await open(url);
}

async function getAccessToken(alias: Alias) {
    const url = 'https://login.salesforce.com/services/oauth2/token';
    const data = buildTokenFormData(alias);

    const response: AxiosResponse<TokenResponseData> = await axios.post(url, data);
    return response.data.access_token;
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
