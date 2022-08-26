import * as httpRequest from '../httprequest';
import { Alias } from '../creds';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import * as fs from 'fs';

jest.mock('axios');
jest.mock('fs');

const mockGet = axios.get as jest.Mock;
const mockPost = axios.post as jest.Mock;
const mockWriteFileSync = fs.writeFileSync as jest.Mock;

function getAlias(): Alias {
    return {
        name: 'test',
        url: 'https://test-domain.my.salesforce.com',
        clientId: 'clientId123',
        clientSecret: 'clientSecret123',
        username: 'test@example.com',
        password: 'password123!',
        securityToken: 'securityToken123',
        currentToken: 'currentToken123'
    };
}

function getAccountResponse() {
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

const accountPath = '/services/data/v55.0/query/?q=SELECT+Id,Name+FROM+Account';

test('get() returns response', async () => {
    //Given
    const alias = getAlias();
    alias.lastRequest = new Date();
    const path = accountPath;

    const response = getAccountResponse();
    mockGet.mockResolvedValue(response as AxiosResponse<any>);

    //When
    const actualResponse = await httpRequest.get(alias, path);

    //Then
    expect(actualResponse.data).toEqual(response.data);
});

test('when alias has no lastRequest, get() returns sets token then returns response', async () => {
    //Given
    const alias = getAlias();
    const path = accountPath;

    const tokenResponse = {
        data: {
            access_token: 'newToken'
        }
    };
    const response = getAccountResponse();
    mockPost.mockResolvedValue(tokenResponse);
    mockGet.mockResolvedValue(response as AxiosResponse<any>);
    mockWriteFileSync.mockClear();

    //When
    const actualResponse = await httpRequest.get(alias, path);

    //Then
    expect(mockWriteFileSync.mock.calls.length).toBe(2);
    expect(alias.currentToken).toBe(tokenResponse.data.access_token);
    expect(alias.lastRequest).toBeDefined();
    expect(actualResponse.data).toEqual(response.data);
});