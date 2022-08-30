import { FieldExpression } from "./field-expression";

describe('FieldExpression.expand()', () => {
    test('creates array [field, operator, convertedOperand]', () => {
        // Given
        const field = 'Name';
        const operator = '='
        const operand = 'Umbrella Corp';
        const fieldExp = new FieldExpression(field);
        fieldExp.operator = operator;
        fieldExp.operand = operand;

        // When
        const actualValue = fieldExp.expand();

        const expectedValue = [field, operator, `'${operand}'`];
        expect(actualValue).toEqual(expectedValue);
    });

    test('if operand string has single quotes, escape them', () => {
        // Given
        const field = 'Name';
        const operator = '=';
        const operand = `O'Donnell's Whisky`;
        const fieldExp = new FieldExpression(field);
        fieldExp.operator = operator;
        fieldExp.operand = operand;

        // When
        const actualValue = fieldExp.expand();

        const expectedValue = [field, operator, `'O\\'Donnell\\'s Whisky'`];
        expect(actualValue).toEqual(expectedValue);
    });

    test('if operand string has backslashes, escape them', () => {
        // Given
        const field = 'Name';
        const operator = '='
        const operand = 'C:\\Games';
        const fieldExp = new FieldExpression(field);
        fieldExp.operator = operator;
        fieldExp.operand = operand;

        // When
        const actualValue = fieldExp.expand();

        const expectedValue = [field, operator, `'C:\\\\Games'`];
        expect(actualValue).toEqual(expectedValue);
    });

    test('if operand is a Date, convert it to a string', () => {
        // Given
        const field = 'CreatedDate';
        const operator = '='
        const operand = new Date('2000-01-01');
        const fieldExp = new FieldExpression(field);
        fieldExp.operator = operator;
        fieldExp.operand = operand;

        // When
        const actualValue = fieldExp.expand();

        const expectedValue = [field, operator, operand.toString()];
        expect(actualValue).toEqual(expectedValue);
    });

    test('if operand is a number, convert it to a string', () => {
        // Given
        const field = 'Number_of_dogs__c';
        const operator = '='
        const operand = 5;
        const fieldExp = new FieldExpression(field);
        fieldExp.operator = operator;
        fieldExp.operand = operand;

        // When
        const actualValue = fieldExp.expand();

        const expectedValue = [field, operator, operand.toString()];
        expect(actualValue).toEqual(expectedValue);
    });

    test('if operand is a null, convert it to a string', () => {
        // Given
        const field = 'Color__c';
        const operator = '='
        const operand = null;
        const fieldExp = new FieldExpression(field);
        fieldExp.operator = operator;
        fieldExp.operand = operand;

        // When
        const actualValue = fieldExp.expand();

        const expectedValue = [field, operator, 'null'];
        expect(actualValue).toEqual(expectedValue);
    });
});