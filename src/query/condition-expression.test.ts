import { ConditionExpression } from "./condition-expression";
import { FieldExpression } from "./field-expression";
import { LogicalOperator } from "./types";

describe('ConditionExpression.fromString()', () => {
    test('if the value is blank, throw an Error', () => {
        // Given
        const value = '';

        // When
        let isError = false;
        try {
            FieldExpression.fromString(value);
        }
        catch(error) {
            isError = true;
        }

        // Then
        expect(isError).toBeTruthy();
    });

    test('if the value is a ConditionExpression, populate the new ConditionExpression', () => {
        // Given
        const value = `Name = 'George AND Color__c = 'Blue'`;

        // When
        const actualConditionExp = ConditionExpression.fromString(value);

        // Then
        const expectedFieldExp1 = new FieldExpression();
        expectedFieldExp1.field = 'Name';
        expectedFieldExp1.operator = '=';
        expectedFieldExp1.operand = `'George'`;

        const expectedOperator: LogicalOperator = 'AND';

        const expectedFieldExp2 = new FieldExpression();
        expectedFieldExp2.field = 'Color__c';
        expectedFieldExp2.operator = '=';
        expectedFieldExp2.operand = `'Blue'`;

        const expectedConditionExp = new ConditionExpression();
        expectedConditionExp.elements = [expectedFieldExp1, expectedOperator, expectedFieldExp2];

        expect(actualConditionExp.elements).toEqual(expectedConditionExp);
    });
});