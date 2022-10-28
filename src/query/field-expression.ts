import { isDateLiteral, Operand, Operator } from "./types";

export class FieldExpression {
    field?: string;
    operator?: Operator;
    operand?: Operand|Operand[];

    constructor(field?: string, operator?: Operator, operand?: Operand) {
        this.field = field;
        this.operator = operator;
        this.operand = operand;
    }

    static fromString(value: string): FieldExpression {
        const alphaRegex = new RegExp('^[A-Za-z]+$');
        if (alphaRegex.test(value)) {
            const fieldExp = new FieldExpression(value);
            return fieldExp;
        }
        else {
            throw new Error('Value is not a valid field expression');
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
        if(this.field) {
            expandedExpression.push(this.field);
        }
        if (this.operator) {
            expandedExpression.push(this.operator);
        }
        if (this.operand !== undefined) {
            expandedExpression.push(this.operandToString());
        }
        return expandedExpression;
    }
}