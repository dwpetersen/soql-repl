import { AxiosError } from 'axios';
import axios from 'axios';
import { OAuthAlias } from "../creds";
import { TokenResponse } from './types';
import * as open from 'open';
import * as express from 'express';
import { Express, Request, Response } from 'express';

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

function buildAuthFormData(alias: OAuthAlias) {
    const data = {
        response_type: 'code',
        client_id: alias.clientId,
        client_secret: alias.clientSecret,
        login_hint: alias.username,
        redirect_uri: alias.redirectURI
    }

    const formData = Object.entries(data).map(entry => {
        return encodeURI(entry[0]) + '=' + encodeURI(entry[1]);
    }).join('&');

    return formData;
}

async function getAccessTokenWithCode(alias: OAuthAlias, code: string) {
    const url = 'https://login.salesforce.com/services/oauth2/token';
    const data = buildTokenFromCodeFormData(alias, code);

    const response: TokenResponse = await axios.post(url, data);
    return response.data.access_token;
}

export function getAccessToken(alias: OAuthAlias) {
    let url =  alias.url + '/services/oauth2/authorize?';
    url += buildAuthFormData(alias);
    
    const app: Express = express();
    const port = 3000;

    return new Promise<string>((resolve, reject) => {
        app.get('/oauth2/callback', (req: Request, res: Response) => {
            const code = req.query.code as string;
    
            getAccessTokenWithCode(alias, code)
                .then(token => {
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