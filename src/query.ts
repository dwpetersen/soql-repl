import { stringify } from 'querystring';
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

export class SOQLQuery {
    private selectItems: string[] = [];
    private fromValue: string = '';
    private whereItems: string[] = [];
    private limitValue?: number;
    public paramString?: string;
    public path?: string;
    public result?: SOQLQueryResult;
    private inWhere: boolean = false;

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
        this.inWhere = true;
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

    private addExpression(operator: string, operand: string|number|Date|null) {
        let stringValue = this.operandToString(operand);

        if (this.inWhere) {
            this.whereItems.push(...[operator, stringValue]);
        }
    }

    equals(operand: string|number|Date|null) {
        this.addExpression('=', operand);
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
