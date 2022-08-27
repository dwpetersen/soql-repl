import { readFileSync } from "fs";
import { AxiosError } from "axios";
import * as path from 'path';
import { Alias } from "../../creds";

const DATA_PATH = path.resolve('src', '__tests__', 'data');

let axiosTemplates = new Map<string, any>();

function createAxiosError(alias: Alias, method: string, name: string, url: string): AxiosError {
    const key = `${method}.error.${name}`;
    let errorTemplate = axiosTemplates.get(key);
    if (!errorTemplate) {
        const fileName = `${name}.json`
        const errorFile = readFileSync(path.resolve(DATA_PATH, 'axios', method, 'error', fileName));
        errorTemplate = JSON.parse(errorFile.toString());
        axiosTemplates.set(key, errorTemplate);
    }
    const errorResponse: AxiosError = {...errorTemplate} as AxiosError;
    errorResponse.config.baseURL = alias.url;
    if (errorResponse.config.headers) {
        errorResponse.config.headers.Authorization = `Bearer ${alias.currentToken}`;
    }
    errorResponse.config.url = url;
    return errorResponse;
}

const getError = {
    notFound: (alias: Alias, url: string): AxiosError => {
        return createAxiosError(alias, 'get', 'ENOTFOUND', url);
    },
    badRequest: (alias: Alias, url: string): AxiosError => {
        return createAxiosError(alias, 'get', 'ERR_BAD_REQUEST', url);
    }
}

export const axios = {
    get: {
        error: getError
    }
}
