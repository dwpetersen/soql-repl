import { Alias } from "../../creds";
import { readFileSync } from "fs";
import { AxiosError } from "axios";

export function createQueryResponse() {
    return { 
        data: {
            "totalSize": 1,
            "done": true,
            "records": [
                {
                "attributes": {
                    "type": "Account",
                    "url": "/services/data/v55.0/sobjects/Account/0015i00000MLQoqAAH"
                },
                "Id": "0015i00000MLQoqAAH",
                "Name": "Burlington Textiles Corp of America"
                }
            ]
        }
    };
}

export function createQueryPath() {
    return '/services/data/v55.0/query/?q=SELECT+Id,Name+FROM+Account';
}

export function createTokenResponse() {
    return {
        data: {
            access_token: 'newToken'
        }
    }
}

export function createAlias(lastRequest?: Date): Alias {
    return {
        name: 'test',
        url: 'https://test-domain.my.salesforce.com',
        clientId: 'clientId123',
        clientSecret: 'clientSecret123',
        username: 'test@example.com',
        password: 'password123!',
        securityToken: 'securityToken123',
        currentToken: 'currentToken123',
        lastRequest
    };
}

let getError: AxiosError;

export function createAxiosGetError() {
    if (!getError) {
        const errorFile = readFileSync('./src/__tests__/data/axios/error/get.json');
        getError = JSON.parse(errorFile.toString());
    }
    return getError;
}