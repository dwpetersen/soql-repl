import * as creds from './creds';
import { OAuthAlias, PasswordAlias } from './creds';
import * as fs from 'fs';
import * as factory from '../__tests__/utils/factory'
import * as path from 'path';

describe('openAlias()', () => {
    test('loads PasswordAlias', () => {
        //Given
        const alias: PasswordAlias = factory.createPasswordAlias();
        const aliasJSON = JSON.stringify(alias);
        const mockReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation();
        mockReadFileSync.mockReturnValue(Buffer.from(aliasJSON));

        //When
        const actualAlias = creds.openAlias(alias.name);

        //Then
        expect(actualAlias).toEqual(alias);
    });

    test('loads OAuthAlias', () => {
        //Given
        const alias: OAuthAlias = factory.createOAuthAlias();
        const aliasJSON = JSON.stringify(alias);
        const mockReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation();
        mockReadFileSync.mockReturnValue(Buffer.from(aliasJSON));

        //When
        const actualAlias = creds.openAlias(alias.name);

        //Then
        expect(actualAlias).toEqual(alias);
    });

    test('when lastRequest is set, converts ISO string to Date object', () => {
        //Given
        const alias = factory.createPasswordAlias(new Date());
        const aliasJSON = JSON.stringify(alias);
        const mockReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation();
        mockReadFileSync.mockReturnValue(Buffer.from(aliasJSON));

        //When
        const actualAlias = creds.openAlias(alias.name);

        //Then
        expect(actualAlias.lastRequest).toBeInstanceOf(Date);
        expect(actualAlias).toEqual(alias);
    });
});

describe('isAlias()', () => {
    test('OAuthAlias is an Alias', () => {
        //Given
        const alias = factory.createOAuthAlias(new Date('2000-01-01'));

        //When
        const isAlias = creds.isAlias(alias);

        //Then
        expect(isAlias).toBeTruthy();
    });

    test('PasswordAlias is an Alias', () => {
        //Given
        const alias = factory.createPasswordAlias(new Date('2000-01-01'));

        //When
        const isAlias = creds.isAlias(alias);

        //Then
        expect(isAlias).toBeTruthy();
    });

    test('Different object is not an Alias', () => {
        //Given
        const alias = {
            things: 'stuff'
        }

        //When
        const isAlias = creds.isAlias(alias);

        //Then
        expect(isAlias).toBeFalsy();
    });
});

describe('isOAuthAlias()', () => {
    test('OAuthAlias is an OAuthAlias', () => {
        //Given
        const alias = factory.createOAuthAlias(new Date('2000-01-01'));

        //When
        const isOAuth = creds.isOAuthAlias(alias);

        //Then
        expect(isOAuth).toBeTruthy();
    });

    test('PasswordAlias is not an OAuthAlias', () => {
        //Given
        const alias = factory.createPasswordAlias(new Date('2000-01-01'));

        //When
        const isOAuth = creds.isOAuthAlias(alias);

        //Then
        expect(isOAuth).toBeFalsy();
    });


    test('Different object is not an OAuthAlias', () => {
        //Given
        const alias = {
            things: 'stuff'
        }

        //When
        const isOAuth = creds.isOAuthAlias(alias);

        //Then
        expect(isOAuth).toBeFalsy();
    });
});

describe('isPasswordAlias()', () => {

    test('PasswordAlias is a PasswordAlias', () => {
        //Given
        const alias = factory.createPasswordAlias(new Date('2000-01-01'));

        //When
        const isPW = creds.isPasswordAlias(alias);

        //Then
        expect(isPW).toBeTruthy();
    });

    test('OAuthAlias is not a PasswordAlias', () => {
        //Given
        const alias = factory.createOAuthAlias(new Date('2000-01-01'));

        //When
        const isPW = creds.isPasswordAlias(alias);

        //Then
        expect(isPW).toBeFalsy();
    });


    test('Different object is not a PasswordAlias', () => {
        //Given
        const alias = {
            things: 'stuff'
        }

        //When
        const isPW = creds.isPasswordAlias(alias);

        //Then
        expect(isPW).toBeFalsy();
    });
});

test('saveAlias() saves alias', () => {
    //Given
    const alias = factory.createPasswordAlias();
    const mockWriteFileSync = jest.spyOn(fs, 'writeFileSync').mockImplementation();

    //When
    creds.saveAlias(alias);

    //Then
    expect(mockWriteFileSync.mock.calls.length).toBe(1);
    
    const expectedPath = path.resolve(creds.CREDS_PATH, `${alias.name}.json`);
    const actualPath = mockWriteFileSync.mock.calls[0][0];
    expect(actualPath).toBe(expectedPath);

    const expectedAliasString = JSON.stringify(alias, null, 4);
    const actualAliasString = mockWriteFileSync.mock.calls[0][1];
    expect(actualAliasString).toBe(expectedAliasString);
});
