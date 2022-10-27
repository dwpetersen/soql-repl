/* eslint-disable @typescript-eslint/unbound-method */
import * as token from './token';
import * as oauth from './oauth';
import axios from 'axios';
import * as fs from 'fs';
import * as factory from '../__tests__/utils/factory';
import * as mocks from '../__tests__/utils/mocks';

let mockPost = jest.spyOn(axios, 'post');
let mockWriteFileSync = jest.spyOn(fs, 'writeFileSync').mockImplementation();

describe('checkCurrentToken()', () => {
    test('if there\'s no token on alias, set new token and lastRequest date', async () => {
        // Given
        const alias = factory.createPasswordAlias();
        alias.currentToken = undefined;
        const tokenResponse = mocks.axios.post.response.token();
        mockPost.mockResolvedValue(tokenResponse);

        // When
        await token.checkCurrentToken(alias);

        // Then
        expect(mockWriteFileSync.mock.calls.length).toBe(1);
        expect(alias.currentToken).toBe(tokenResponse.data.access_token);
        expect(alias.lastRequest).toBeDefined();
    });

    test('if the token has expired, set new token and lastRequest date', async () => {
        // Given
        const alias = factory.createPasswordAlias();
        const oldLastRequest = new Date();
        oldLastRequest.setHours(oldLastRequest.getHours() - 2);
        alias.lastRequest = oldLastRequest;

        const tokenResponse = mocks.axios.post.response.token();
        mockPost.mockResolvedValue(tokenResponse);

        // When
        await token.checkCurrentToken(alias);

        // Then
        expect(mockWriteFileSync.mock.calls.length).toBe(1);
        expect(alias.currentToken).toBe(tokenResponse.data.access_token);
        expect(alias.lastRequest.getTime()).toBeGreaterThan(oldLastRequest.getTime());
    });

    test('if the token for OAuthAlias has expired, set new token and lastRequest date', async () => {
        // Given
        const alias = factory.createOAuthAlias();
        const oldLastRequest = new Date();
        oldLastRequest.setHours(oldLastRequest.getHours() - 2);
        alias.lastRequest = oldLastRequest;

        const mockGetAccessToken = jest.spyOn(oauth, 'getAccessToken');
        const expectedToken = 'token123';
        mockGetAccessToken.mockResolvedValue(expectedToken);

        // When
        await token.checkCurrentToken(alias);

        // Then
        expect(mockWriteFileSync.mock.calls.length).toBe(1);
        expect(alias.currentToken).toBe(expectedToken);
        expect(alias.lastRequest.getTime()).toBeGreaterThan(oldLastRequest.getTime());
    });
});

beforeEach(() => {
    mockPost = jest.spyOn(axios, 'post');
    mockWriteFileSync = jest.spyOn(fs, 'writeFileSync').mockImplementation();
});

afterEach(() => {
    jest.clearAllMocks();
});