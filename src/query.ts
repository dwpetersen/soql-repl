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
    selectItems: string[] = [];
    fromValue: string = '';
    whereItems = [];
    limitValue: number = 0;
    queryParamString: string = '';

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
        this.queryParamString = ['SELECT',
                                 this.selectItems.join(','),
                                 'FROM',
                                 this.fromValue,
                                 'LIMIT',
                                 this.limitValue].join('+');
    }
}
