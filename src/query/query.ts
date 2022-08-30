import { Alias } from '../creds'
import * as httpRequest from '../httprequest';
import { FieldExpression } from './field-expression';
import { ComparisonOperator, LogicalOperator, Operand } from './types';

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

type WhereItem = FieldExpression|LogicalOperator;

export const QUERY_PATH = '/services/data/v55.0/query/?q=';
export const ERROR_PATH_MUST_BE_SET = 'Path must be set on SOQLQuery';

export class SOQLQuery {
    selectItems: string[] = [];
    fromValue = '';
    whereItems: WhereItem[] = [];
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
        this.whereItems.push(new FieldExpression(field));
        return this;
    }

    private expandWhereItems() {
        const expandedItems: string[] = [];
        this.whereItems.forEach(e => {
            if (e instanceof FieldExpression) {
                expandedItems.push(...e.expand());
            }
            else {
                expandedItems.push(e);
            }
        });
        return expandedItems;
    }

    private handleOperation(operator: ComparisonOperator, operand: Operand|Operand[]) {
        if (this.currentStatement === Statements.WHERE) {
            const expression = this.whereItems[this.whereItems.length - 1] as FieldExpression;
            expression.operator = operator;
            expression.operand = operand;
        }
    }

    equals(operand: Operand) {
        this.handleOperation('=', operand);
        return this;
    }

    notEquals(operand: Operand) {
        this.handleOperation('!=', operand);
        return this;
    }

    lessThan(operand: Operand) {
        this.handleOperation('<', operand);
        return this;
    }

    lessOrEqual(operand: Operand) {
        this.handleOperation('<=', operand);
        return this;
    }

    greaterThan(operand: Operand) {
        this.handleOperation('>', operand);
        return this;
    }

    greaterOrEqual(operand: Operand) {
        this.handleOperation('>=', operand);
        return this;
    }

    in(...operandArray: Operand[]) {
        this.handleOperation('IN', operandArray);
        return this;
    }

    notIn(...operandArray: Operand[]) {
        this.handleOperation('NOT IN', operandArray);
        return this;
    }

    like(operand: string) {
        this.handleOperation('LIKE', operand);
        return this;
    }

    includes(...operandArray: string[]) {
        this.handleOperation('INCLUDES', operandArray);
        return this;
    }

    excludes(...operandArray: string[]) {
        this.handleOperation('EXCLUDES', operandArray);
        return this;
    }

    and(field: string) {
        if (this.currentStatement === Statements.WHERE) {
            this.whereItems.push('AND', new FieldExpression(field));
        }
        return this;
    }

    or(field: string) {
        if (this.currentStatement === Statements.WHERE) {
            this.whereItems.push('OR', new FieldExpression(field));
        }
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
                                 ...this.expandWhereItems(),
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
