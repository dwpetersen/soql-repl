import * as creds from './creds';
import { OAuthAlias, PasswordAlias } from './creds';
import * as fs from 'fs';
import * as factory from './__tests__/utils/factory'
import * as path from 'path';

test('openAlias() loads PasswordAlias', () => {
    //Given
    const alias: PasswordAlias = factory.createPasswordAlias();
    const aliasJSON = JSON.stringify(alias);
    const mockReadFileSync = jest.spyOn(fs, 'readFileSync');
    mockReadFileSync.mockReturnValue(Buffer.from(aliasJSON));

    //When
    const actualAlias = creds.openAlias(alias.name);

    //Then
    expect(actualAlias).toEqual(alias);
});

test('openAlias() loads OAuthAlias', () => {
    //Given
    const alias: OAuthAlias = factory.createOAuthAlias();
    const aliasJSON = JSON.stringify(alias);
    const mockReadFileSync = jest.spyOn(fs, 'readFileSync');
    mockReadFileSync.mockReturnValue(Buffer.from(aliasJSON));

    //When
    const actualAlias = creds.openAlias(alias.name);

    //Then
    expect(actualAlias).toEqual(alias);
});

test('when lastRequest is set, openAlias() converts ISO string to Date object', () => {
    //Given
    const alias = factory.createPasswordAlias(new Date());
    const aliasJSON = JSON.stringify(alias);
    const mockReadFileSync = jest.spyOn(fs, 'readFileSync');
    mockReadFileSync.mockReturnValue(Buffer.from(aliasJSON));

    //When
    const actualAlias = creds.openAlias(alias.name);

    //Then
    expect(actualAlias.lastRequest).toBeInstanceOf(Date);
    expect(actualAlias).toEqual(alias);
});

test('saveAlias() saves alias', () => {
    //Given
    const alias = factory.createPasswordAlias();
    const mockWriteFileSync = jest.spyOn(fs, 'writeFileSync');

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
