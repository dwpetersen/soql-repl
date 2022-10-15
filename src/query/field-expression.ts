import { isDateLiteral, Operand, Operator } from "./types";

export class FieldExpression {
    field: string;
    operator?: Operator;
    operand?: Operand|Operand[];

    constructor(field: string) {
        this.field = field;
    }

    private operandToString(operand?: Operand) {
        const operandToConvert = operand ? operand : this.operand;
        let stringValue = '';
        if(operandToConvert) {
            if (typeof operandToConvert === 'string') {
                if(isDateLiteral(operandToConvert)) {
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
        // disabled this lint because value is passed in from javascript
        // not typescript
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        else {
            stringValue = 'null';
        }

        return stringValue;
    }

    expand(): string[] {
        const expandedExpression: string[] = [this.field];
        if(this.operator) {
            expandedExpression.push(this.operator);
        }
        if(this.operand !== undefined) {
            expandedExpression.push(this.operandToString());
        }
        return expandedExpression;
    }
}