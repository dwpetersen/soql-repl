import * as httpRequest from '../httprequest';
import { Alias } from '../creds';
import axios from 'axios';
import { AxiosResponse } from 'axios';

jest.mock('axios');

const mockedGet = axios.get as jest.Mock;

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

test('get() returns response', async () => {
    const response = { 
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
    
    const alias = getAlias();
    alias.lastRequest = new Date();
    const path = '/services/data/v55.0/query/?q=SELECT+Id,Name+FROM+Account';

    mockedGet.mockResolvedValue(response as AxiosResponse<any>);

    const actualResponse = await httpRequest.get(alias, path);
    expect(actualResponse.data).toEqual(response.data);
});