import { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';
import { Alias } from './auth/creds';
import * as creds from './auth/creds';
import * as token from './auth/token';

type AxiosGetParams = Parameters<typeof axios.get>;

function getDefaultHeaders(alias: Alias) {
    if (alias.currentToken) {
        return {
            'Authorization': `Bearer ${alias.currentToken}`,
            'Accept': 'application/json'
        }
    }
    else {
        throw new ReferenceError('currentToken on Alias is not set');
    }
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
    await token.checkCurrentToken(alias);
    const defaultHeaders = getDefaultHeaders(alias);
    const config = {
        baseURL: alias.url,
        headers: { ...defaultHeaders, ...headers }
    }

    const params: AxiosGetParams = [path, config];
    const wrappedAxiosGet = (...args: AxiosGetParams) => {
        return axios.get<T>(...args);
    };

    const response = await retry(wrappedAxiosGet, params);
    alias.lastRequest = new Date();
    creds.saveAlias(alias);
    return response;
}
