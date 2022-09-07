import { readFileSync } from "fs";
import { AxiosError, AxiosResponse } from "axios";
import * as path from 'path';
import { Alias } from "../../creds";

const DATA_PATH = path.resolve('src', '__tests__', 'data');

const axiosTemplates = new Map<string, AxiosError|AxiosResponse>();

function createAxiosError(alias: Alias, method: string, name: string, url: string): AxiosError {
    const key = `${method}.error.${name}`;
    let errorTemplate = axiosTemplates.get(key);

    if (!errorTemplate) {
        const fileName = `${name}.json`
        const errorFile = readFileSync(path.resolve(DATA_PATH, 'axios', method, 'error', fileName));
        errorTemplate = JSON.parse(errorFile.toString()) as AxiosError;
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

function createFormPostResponse(name: string, baseURL: string, url: string): AxiosResponse {
    const method = 'post';
    const responseType = 'response';

    const key = `${method}.${responseType}.${name}`;
    let responseTemplate = axiosTemplates.get(key);
    if (!responseTemplate) {
        const fileName = `${name}.json`
        const responseFile = readFileSync(path.resolve(DATA_PATH, 'axios', method, responseType, fileName));
        responseTemplate = JSON.parse(responseFile.toString()) as AxiosError;
        axiosTemplates.set(key, responseTemplate);
    }

    const response: AxiosResponse = {...responseTemplate} as AxiosResponse;
    response.config.baseURL = baseURL;
    response.config.url = url;
    return response;
}

const getError = {
    notFound: (alias: Alias, url: string): AxiosError => {
        return createAxiosError(alias, 'get', 'ENOTFOUND', url);
    },
    badRequest: (alias: Alias, url: string): AxiosError => {
        return createAxiosError(alias, 'get', 'ERR_BAD_REQUEST', url);
    }
}

const postResponse = {
    oauthCode: (alias: Alias): AxiosResponse => {
        const url = alias.url + '/services/oauth2/authorize?'
        return createFormPostResponse('oauthCode', alias.url, url);
    }
}

export const axios = {
    get: {
        error: getError
    },
    post: {
        response: postResponse
    }
}
