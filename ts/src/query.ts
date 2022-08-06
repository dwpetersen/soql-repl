export class SOQLQuery {
    selectItems = [];
    fromValue;
    whereItems = [];
    limitValue;
    queryParamString;

    constructor() {

    }

    select(...fields) {
        this.selectItems.push(...fields);
        return this;
    }

    from(sObject) {
        this.fromValue = sObject;
        return this;
    }

    limit(value) {
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
