/* eslint-disable @typescript-eslint/unbound-method */
import * as token from './token';
import { TokenResponseData } from './types';
import axios from 'axios';
import * as fs from 'fs';
import * as factory from '../__tests__/utils/factory';
import * as mocks from '../__tests__/utils/mocks';

jest.mock('axios');

let mockPost = jest.spyOn(axios, 'post');
let mockWriteFileSync = jest.spyOn(fs, 'writeFileSync');

describe('checkCurrentToken()', () => {
    test('if there\'s no token on alias, set new token and lastRequest date', async () => {
        // Given
        const alias = factory.createPasswordAlias();
        alias.currentToken = undefined;
        const tokenResponse = mocks.axios.post.response.token();
        mockPost.mockResolvedValue(tokenResponse)

        // When
        await token.checkCurrentToken(alias);

        // Then
        //Then
        expect(mockWriteFileSync.mock.calls.length).toBe(1);
        const tokenData = tokenResponse.data as TokenResponseData;
        expect(alias.currentToken).toBe(tokenData.access_token);
    });
});

beforeEach(() => {
    mockPost = jest.spyOn(axios, 'post');
    mockWriteFileSync = jest.spyOn(fs, 'writeFileSync');
});

afterEach(() => {
    jest.clearAllMocks();
});