import { Alias } from './creds'
import * as httpRequest from './httprequest';

export interface SOQLQueryResult {
    totalSize: number;
    done: boolean;
    records: SObject[];
}

export interface SObject {
    attributes: {
        type: string;
        url: string;
    };
}

export enum Statements {
    SELECT,
    FROM,
    WHERE,
    LIMIT
}

type Operator = '='|'!='|'<'|'<='|
                '>'|'>='|'LIKE'|'IN'|
                'NOT IN'|'INCLUDES'|'EXCLUDES';

type LogicalOperator = 'AND'|'OR'|'NOT';

type Operand = string|number|Date|null;

export const QUERY_PATH = '/services/data/v55.0/query/?q=';
export const ERROR_PATH_MUST_BE_SET = 'Path must be set on SOQLQuery'

export class SOQLQuery {
    selectItems: string[] = [];
    fromValue = '';
    whereItems: string[] = [];
    limitValue?: number;
    paramString?: string;
    path?: string;
    result?: SOQLQueryResult;
    currentStatement?: Statements;

    select(...fields: string[]) {
        this.selectItems.push(...fields);
        return this;
    }

    from(sObject: string) {
        this.fromValue = sObject;
        return this;
    }

    where(field: string) {
        this.currentStatement = Statements.WHERE;
        this.whereItems.push(field);
        return this;
    }

    private operandToString(operand: Operand) {
        let stringValue = '';
        if (typeof operand === 'string') {
            stringValue = operand.replaceAll('\\', '\\\\')
                                 .replaceAll('\'', '\\\'');
            stringValue = `'${stringValue}'`;
        }
        else if (operand instanceof Date ||
                 typeof operand === 'number') {
            stringValue = operand.toString();
        }
        // disabled this lint because value is passed in from javascript
        // not typescript
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        else if (operand === null) {
            stringValue = 'null';
        }

        return stringValue;
    }

    private addExpression(operator: Operator, operand: Operand, itemList: unknown[]) {
        const stringValue = this.operandToString(operand);
        itemList.push(...[operator, stringValue]);
    }

    private handleOperator(operator: Operator, operand: Operand) {
        if (this.currentStatement === Statements.WHERE) {
            this.addExpression(operator, operand, this.whereItems);
        }
    }

    private handleArrayOperation(operator: Operator, operandArray: Operand[]) {
        if (this.currentStatement === Statements.WHERE) {
            const innerValue = operandArray.map(e => this.operandToString(e))
                                           .join(',');
            this.whereItems.push(...[operator, `(${innerValue})`]);
        }
    }

    equals(operand: Operand) {
        this.handleOperator('=', operand);
        return this;
    }

    notEquals(operand: Operand) {
        this.handleOperator('!=', operand);
        return this;
    }

    lessThan(operand: Operand) {
        this.handleOperator('<', operand);
        return this;
    }

    lessOrEqual(operand: Operand) {
        this.handleOperator('<=', operand);
        return this;
    }

    greaterThan(operand: Operand) {
        this.handleOperator('>', operand);
        return this;
    }

    greaterOrEqual(operand: Operand) {
        this.handleOperator('>=', operand);
        return this;
    }

    in(...operandArray: Operand[]) {
        this.handleArrayOperation('IN', operandArray);
        return this;
    }

    notIn(...operandArray: Operand[]) {
        this.handleArrayOperation('NOT IN', operandArray);
        return this;
    }

    like(operand: string) {
        this.handleOperator('LIKE', operand);
        return this;
    }

    includes(...operandArray: string[]) {
        this.handleArrayOperation('INCLUDES', operandArray);
        return this;
    }

    excludes(...operandArray: string[]) {
        this.handleArrayOperation('EXCLUDES', operandArray);
        return this;
    }

    limit(value: number) {
        this.limitValue = value;
        return this;
    }

    build() {
        this.paramString = encodeURI(['SELECT',
                                 this.selectItems.join(','),
                                 'FROM',
                                 this.fromValue,
                                 'WHERE',
                                 ...this.whereItems,
                                 'LIMIT',
                                 this.limitValue].join('+'));
        this.path = QUERY_PATH + this.paramString;
        return this;
    }

    async execute(alias: Alias) {
        if (this.path) {
            const response = await httpRequest.get(alias, this.path);
            this.result = response.data;
        }
        else {
            throw new Error(ERROR_PATH_MUST_BE_SET);
        }
    }
}
