import * as creds from '../creds';
import * as fs from 'fs';
import * as factory from './utils/factory'

test('openAlias() loads alias', () => {
    //Given
    const alias = factory.createAlias();
    const aliasJSON = JSON.stringify(alias) 
    const mockReadFileSync = jest.spyOn(fs, 'readFileSync');
    mockReadFileSync.mockReturnValue(Buffer.from(aliasJSON));

    //When
    const actualAlias = creds.openAlias(alias.name);

    //Then
    expect(actualAlias).toEqual(alias);
});

test('when lastRequest is set, openAlias() converts ISO string to Date object', () => {
    //Given
    const alias = factory.createAlias(new Date());
    const aliasJSON = JSON.stringify(alias) 
    const mockReadFileSync = jest.spyOn(fs, 'readFileSync');
    mockReadFileSync.mockReturnValue(Buffer.from(aliasJSON));

    //When
    const actualAlias = creds.openAlias(alias.name);

    //Then
    expect(actualAlias).toEqual(alias);
});
