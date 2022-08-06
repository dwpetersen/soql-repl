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
    private whereItems = [];
    private limitValue?: number;
    public paramString?: string;
    public path?: string;
    public result?: SOQLQueryResult;

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

    limit(value: number) {
        this.limitValue = value;
        return this;
    }

    build() {
        this.paramString = ['SELECT',
                                 this.selectItems.join(','),
                                 'FROM',
                                 this.fromValue,
                                 'LIMIT',
                                 this.limitValue].join('+');
        this.path = `/services/data/v55.0/query/?q=${this.paramString}`;
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
