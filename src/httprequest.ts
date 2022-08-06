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

async function retry<T>(request: (...args: any) => Promise<any>, params: any[], retries: number): Promise<T> {
    return new Promise<T>( async (resolve, reject) => {
        let count = 0;
        let success = false;
        while (count < retries && !success) {
            try {
                const response = await request(...params);
                success = true;
                resolve(response);
            }
            catch (err: any) {
                if (!err.request) {
                    reject(err);
                }
            }

            count++;
        }

        reject(`Could not complete request. Maximum retries reached (${retries}).`);
    });
}

export async function get<T = any>(alias: Alias, path: string, headers?: object): Promise<AxiosResponse<T>> {
    const defaultHeaders = getDefaultHeaders(alias);
    const config = {
        baseURL: alias.url,
        headers: { ...defaultHeaders, ...headers }
    }

    const params = [path, config];

    await checkCurrentToken(alias);
    const retryPromise = retry<AxiosResponse<T>>(axios.get<T>, params, 3);
    
    return new Promise<AxiosResponse<T>>((resolve, reject) => {
        retryPromise.then((response) => {
            alias.lastRequest = new Date();
            creds.saveAlias(alias);
            resolve(response);
        }).catch(reject);
    });
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
