/* eslint-disable @typescript-eslint/unbound-method */
import * as password from './password';
import axios from 'axios';
import * as factory from '../__tests__/utils/factory';
import * as mocks from '../__tests__/utils/mocks';

describe('getAccessToken()', () => {
    test('returns a token', async () => {
        // Given
        const alias = factory.createPasswordAlias();
        const tokenResponse = mocks.axios.post.response.token();

        const mockPost = jest.spyOn(axios, 'post');
        mockPost.mockResolvedValue(tokenResponse);

        // When
        const token = await password.getAccessToken(alias);

        // Then
        const tokenData = tokenResponse.data;
        expect(token).toBe(tokenData.access_token);
    });
});
