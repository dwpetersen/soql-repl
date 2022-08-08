import { AxiosResponse } from 'axios';
import axios from 'axios';
import { Alias } from './creds';
import * as creds from './creds';

const TOKEN_TIMEOUT_MINS = 60;

const getDefaultHeaders = (alias: Alias) => {
    return {
        'Authorization': `Bearer ${alias.currentToken}`,
        'Accept': 'application/json'
    }
}

const buildFormData = (alias: Alias) => {
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

async function retry<T>(request: (...args: any) => Promise<any>,
                        params: any[],
                        retries: number = 3): Promise<T> {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await request(...params);
            return response;
        }
        catch (err: any) {
            if (err.response) {
                throw err;
            }
        }
    }

    throw new Error(`Could not complete request. Maximum retries reached (${retries}).`);
}

export async function get<T = any>(alias: Alias, path: string, headers?: object): Promise<AxiosResponse<T>> {
    const defaultHeaders = getDefaultHeaders(alias);
    const config = {
        baseURL: alias.url,
        headers: { ...defaultHeaders, ...headers }
    }

    const params = [path, config];

    try {
        await checkCurrentToken(alias);
        const response = await retry<AxiosResponse<T>>(axios.get<T>, params);
        alias.lastRequest = new Date();
        creds.saveAlias(alias);
        return response;
    }
    catch (err) {
        throw err;
    }
}

const getAccessToken = async (alias: Alias) => {
    try {
        const url = 'https://login.salesforce.com/services/oauth2/token';
        const data = buildFormData(alias);

        const response = await axios.post(url, data);
        return response.data.access_token;
    }
    catch(error) {
        throw error;
    }
};

const isTokenExpired = (alias: Alias) => {
    return !alias.lastRequest || 
           Date.now() - alias.lastRequest.getTime() > (1000*60*TOKEN_TIMEOUT_MINS);
}

const checkCurrentToken = async (alias: Alias) => {
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
        try {
            const token = await getAccessToken(alias);
            alias.currentToken = token;
            alias.lastRequest = new Date();
            creds.saveAlias(alias);
        }
        catch (error) {
            throw error;
        }         
    }
};
