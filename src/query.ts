import { Alias } from './creds'
import * as httpRequest from './httprequest';

export type SOQLQueryResult = {
    totalSize: number;
    done: boolean;
    records: SObject[];
};

export interface SObject {
    attributes: {
        type: string;
        url: string;
    };
}

enum Statements {
    SELECT,
    FROM,
    WHERE,
    LIMIT
}

type Operator = '='|'!='|'<'|'<='|
                '>'|'>='|'LIKE'|'IN'|
                'NOT IN'|'INCLUDES'|'EXCLUDES';

export class SOQLQuery {
    selectItems: string[] = [];
    fromValue: string = '';
    whereItems: string[] = [];
    limitValue?: number;
    paramString?: string;
    path?: string;
    result?: SOQLQueryResult;
    currentStatement?: Statements;

    constructor() {
    }

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

    private operandToString(operand: string|number|Date|null) {
        let stringValue: string = '';
        if (typeof operand === 'string') {
            stringValue = `'${operand}'`;
        }
        else if (operand instanceof Date ||
                 typeof operand === 'number') {
            stringValue = operand.toString();
        }
        else if (operand === null) {
            stringValue = 'null';
        }

        return stringValue;
    }

    private addExpression(operator: Operator, operand: string|number|Date|null, itemList: any[]) {
        let stringValue = this.operandToString(operand);
        itemList.push(...[operator, stringValue]);
    }

    equals(operand: string|number|Date|null) {
        if (this.currentStatement === Statements.WHERE) {
            this.addExpression('=', operand, this.whereItems);
        }
        return this;
    }

    limit(value: number) {
        this.limitValue = value;
        return this;
    }

    build() {
        this.paramString = ['SELECT',
                                 this.selectItems.join(','),
                                 'FROM',
                                 this.fromValue,
                                 'WHERE',
                                 ...this.whereItems,
                                 'LIMIT',
                                 this.limitValue].join('+');
        this.path = encodeURI(`/services/data/v55.0/query/?q=${this.paramString}`);
    }

    async execute(alias: Alias) {
        if (this.path) {
            const response = await httpRequest.get(alias, this.path);
            this.result = response.data;
        }
        else {
            throw new Error('Path must be set on SOQLQuery');
        }
    }
}
