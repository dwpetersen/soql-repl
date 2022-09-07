import { AxiosResponse } from 'axios';
import axios from 'axios';
import { PasswordAlias } from '../creds';
import { TokenResponseData } from './types';

function buildFormData(alias: PasswordAlias) {
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

export async function getAccessToken(alias: PasswordAlias) {
    const url = 'https://login.salesforce.com/services/oauth2/token';
    const data = buildFormData(alias);

    const response: AxiosResponse<TokenResponseData> = await axios.post(url, data);
    return response.data.access_token;
}