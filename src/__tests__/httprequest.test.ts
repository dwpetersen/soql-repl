import * as httpRequest from '../httprequest';
import { Alias } from '../creds';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import * as fs from 'fs';
import * as factory from './factory/util'

jest.mock('axios');
jest.mock('fs');

const mockGet = axios.get as jest.Mock;
const mockPost = axios.post as jest.Mock;
const mockWriteFileSync = fs.writeFileSync as jest.Mock;

describe('get()', () => {
    test('returns response', async () => {
        //Given
        const alias = factory.createAlias(new Date());
        const path = factory.createQueryPath();
    
        const response = factory.createQueryResponse();
        mockGet.mockResolvedValue(response as AxiosResponse<any>);
    
        //When
        const actualResponse = await httpRequest.get(alias, path);
    
        //Then
        expect(actualResponse.data).toEqual(response.data);
    });
    
    test('when alias has no lastRequest, sets token then returns response', async () => {
        //Given
        const alias = factory.createAlias();
        const path = factory.createQueryPath();
    
        const tokenResponse = factory.createTokenResponse();
        const response = factory.createQueryResponse();
        mockPost.mockResolvedValue(tokenResponse);
        mockGet.mockResolvedValue(response as AxiosResponse<any>);
    
        //When
        const actualResponse = await httpRequest.get(alias, path);
    
        //Then
        expect(mockWriteFileSync.mock.calls.length).toBe(2);
        expect(alias.currentToken).toBe(tokenResponse.data.access_token);
        expect(alias.lastRequest).toBeDefined();
        expect(actualResponse.data).toEqual(response.data);
    });
    
    test('when token is expired, sets token then returns response', async () => {
        //Given
        const lastRequest = new Date();
        lastRequest.setHours(lastRequest.getHours() - 2);
        const alias = factory.createAlias(lastRequest);
    
        const path = factory.createQueryPath();
    
        const tokenResponse = factory.createTokenResponse();
        const response = factory.createQueryResponse();
        mockPost.mockResolvedValue(tokenResponse);
        mockGet.mockResolvedValue(response as AxiosResponse<any>);
    
        //When
        const actualResponse = await httpRequest.get(alias, path);
    
        //Then
        expect(mockWriteFileSync.mock.calls.length).toBe(2);
        expect(alias.currentToken).toBe(tokenResponse.data.access_token);
        expect(alias.lastRequest).toBeDefined();
        expect(actualResponse.data).toEqual(response.data);
    });
});

afterEach(() => {
    jest.clearAllMocks();
});