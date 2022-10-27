/* eslint-disable @typescript-eslint/unbound-method */
import * as httpRequest from './httprequest';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import * as fs from 'fs';
import * as factory from './__tests__/utils/factory';
import * as mocks from './__tests__/utils/mocks';

jest.mock('axios');

const mockGet = axios.get as jest.Mock;
const mockPost = axios.post as jest.Mock;

describe('get()', () => {
    test('returns response', async () => {
        //Given
        const alias = factory.createPasswordAlias(new Date());
        const path = factory.createQueryPath();
    
        const response = factory.createQueryResponse();
        mockGet.mockResolvedValue(response as AxiosResponse);

        jest.spyOn(fs, 'writeFileSync').mockImplementation();
    
        //When
        const actualResponse = await httpRequest.get(alias, path);
    
        //Then
        expect(actualResponse.data).toEqual(response.data);
    });
    
    test('when alias has no lastRequest, sets token then returns response', async () => {
        //Given
        const alias = factory.createPasswordAlias();
        const path = factory.createQueryPath();
    
        const tokenResponse = factory.createTokenResponse();
        const response = factory.createQueryResponse();
        mockPost.mockResolvedValue(tokenResponse);
        mockGet.mockResolvedValue(response as AxiosResponse);

        const mockWriteFileSync = jest.spyOn(fs, 'writeFileSync').mockImplementation();
    
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
        const alias = factory.createPasswordAlias(lastRequest);
    
        const path = factory.createQueryPath();
    
        const tokenResponse = factory.createTokenResponse();
        const response = factory.createQueryResponse();
        mockPost.mockResolvedValue(tokenResponse);
        mockGet.mockResolvedValue(response as AxiosResponse);

        const mockWriteFileSync = jest.spyOn(fs, 'writeFileSync').mockImplementation();
    
        //When
        const actualResponse = await httpRequest.get(alias, path);
    
        //Then
        expect(mockWriteFileSync.mock.calls.length).toBe(2);
        expect(alias.currentToken).toBe(tokenResponse.data.access_token);
        expect(alias.lastRequest).toBeDefined();
        expect(actualResponse.data).toEqual(response.data);
    });

    test('when ENOTFOUND error occurs, three attempts are made before throwing error', async () => {
        //Given
        const alias = factory.createPasswordAlias(new Date());
        const path = factory.createQueryPath();
    
        const response = mocks.axios.get.error.notFound(alias, path);
        mockGet.mockRejectedValue(response);

        jest.spyOn(fs, 'writeFileSync').mockImplementation();
    
        //When
        let isError = false;
        try {
            await httpRequest.get(alias, path);
        }
        catch (err) {
            isError = true;
        }
    
        //Then
        expect(isError).toBeTruthy();
        expect(mockGet.mock.calls.length).toBe(3);
    });

    test('when error response is received, an error is thrown', async () => {
        //Given
        const alias = factory.createPasswordAlias(new Date());
        const path = factory.createQueryPath();

        jest.spyOn(fs, 'writeFileSync').mockImplementation();
    
        const response = mocks.axios.get.error.badRequest(alias, path);
        mockGet.mockRejectedValue(response);
    
        //When
        let isError = false;
        try {
            await httpRequest.get(alias, path);
        }
        catch (err) {
            isError = true;
        }
    
        //Then
        expect(isError).toBeTruthy();
        expect(mockGet.mock.calls.length).toBe(1);
    });
});

afterEach(() => {
    jest.clearAllMocks();
});