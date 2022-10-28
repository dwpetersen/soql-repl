import { getComparsionOperators, hasComparisonOperator, isDateLiteral, isField, Operand, Operator } from "./types";

const ERROR_NOT_VALID_FIELD_EXPRESSION = 'Value is not a valid field expression';

export class FieldExpression {
    field?: string;
    operator?: Operator;
    operand?: Operand|Operand[];
    brackets = false;


    constructor(field?: string, operator?: Operator, operand?: Operand, brackets?: boolean) {
        this.field = field;
        this.operator = operator;
        this.operand = operand;
        this.brackets = brackets ? brackets : false;
    }
    
    private static hasBrackets(value: string) {
        return value.includes('(') && value.includes(')');
    }

    static fromString(value: string): FieldExpression {
        if (isField(value)) {
            return new FieldExpression(value);
        }
        else if (hasComparisonOperator(value)) {
            let brackets = false;
            let strippedValue = '';
            if (FieldExpression.hasBrackets(value)) {
                brackets = true;
                if (!(value.startsWith('(') && value.endsWith(')'))) {
                    throw new Error(ERROR_NOT_VALID_FIELD_EXPRESSION);
                }
                strippedValue = value.replace(/[ ()]/g,'');
            }
            else {
                strippedValue = value.replace(/ /g,'');
            }
            const containedOperators = getComparsionOperators().filter(item => strippedValue.includes(item));
            if (containedOperators.length != 1) {
                throw new Error(ERROR_NOT_VALID_FIELD_EXPRESSION);
            }
            const operator = containedOperators[0] as Operator;
            const [field, operand] = strippedValue.split(operator);
            if (!isField(field)) {
                throw new Error(ERROR_NOT_VALID_FIELD_EXPRESSION);
            }
            return new FieldExpression(field, operator, operand, brackets);
        }
        else {
            throw new Error(ERROR_NOT_VALID_FIELD_EXPRESSION);
        }
    }

    private operandToString(operand?: Operand) {
        const operandToConvert = operand ? operand : this.operand;
        let stringValue = '';
        if(operandToConvert) {
            if (typeof operandToConvert === 'string') {
                if (isDateLiteral(operandToConvert)) {
                    stringValue = operandToConvert;
                }
                else {
                    stringValue = operandToConvert.replaceAll('\\', '\\\\')
                                    .replaceAll('\'', '\\\'');
                    stringValue = `'${stringValue}'`;
                }
            }
            else if (operandToConvert instanceof Date ||
                    typeof operandToConvert === 'number') {
                stringValue = operandToConvert.toString();
            }
            else if (Array.isArray(operandToConvert)) {
                const innerValue = operandToConvert.map(e => this.operandToString(e))
                                            .join(',');
                stringValue = `(${innerValue})`;
            }
        }
        else {
            stringValue = 'null';
        }

        return stringValue;
    }

    expand(): string[] {
        const expandedExpression: string[] = [];
        if (this.brackets) {
            expandedExpression.push('(');
        }
        if (this.field) {
            expandedExpression.push(this.field);
        }
        if (this.operator) {
            expandedExpression.push(this.operator);
        }
        if (this.operand !== undefined) {
            expandedExpression.push(this.operandToString());
        }
        if (this.brackets) {
            expandedExpression.push(')');
        }
        return expandedExpression;
    }
}