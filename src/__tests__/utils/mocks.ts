import { readFileSync } from "fs";
import { AxiosError } from "axios";
import * as path from 'path';

const DATA_PATH = path.resolve('src', '__tests__', 'data');

let axiosTemplates = new Map<string, any>();

function createAxiosError(method: string, name: string, url?: string): AxiosError {
    const key = `${method}.error.${name}`;
    let errorTemplate = axiosTemplates.get(key);
    if (!errorTemplate) {
        const fileName = `${name}.json`
        const errorFile = readFileSync(path.resolve(DATA_PATH, 'axios', method, 'error', fileName));
        errorTemplate = JSON.parse(errorFile.toString());
        axiosTemplates.set(key, errorTemplate);
    }
    const errorResponse = {...errorTemplate}
    errorResponse.config.url = url ? url : errorResponse.config.url;
    return errorResponse;
}

const getError = {
    notFound: (url?: string): AxiosError => {
        return createAxiosError('get', 'ENOTFOUND', url);
    },
    badRequest: (url?: string): AxiosError => {
        return createAxiosError('get', 'ERR_BAD_REQUEST', url);
    }
}

export const axios = {
    get: {
        error: getError
    }
}
