import * as types from './types'

describe('isField()', () => {
    test('allows a string with letters only', () => {
        // Given
        const value = 'Name';

        // When
        const isAField = types.isField(value);

        // Then
        expect(isAField).toBeTruthy();
    });

    test('allows a custom field', () => {
        // Given
        const value = 'Custom_Name__c';

        // When
        const isAField = types.isField(value);

        // Then
        expect(isAField).toBeTruthy();
    });

    test('allows a custom field with numbers', () => {
        // Given
        const value = 'Custom_Name1__c';

        // When
        const isAField = types.isField(value);

        // Then
        expect(isAField).toBeTruthy();
    });

    test('disallows spaces', () => {
        // Given
        const value = 'Custom_Na me1__c';

        // When
        const isAField = types.isField(value);

        // Then
        expect(isAField).toBeFalsy();
    });

    test('disallows other special characters', () => {
        // Given
        const value = 'Custom_Na$me1__c';

        // When
        const isAField = types.isField(value);

        // Then
        expect(isAField).toBeFalsy();
    });
});