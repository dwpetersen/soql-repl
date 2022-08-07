import { QUERY_PATH, SOQLQuery, Statements } from '../query'

test('select() adds items to selectItems', () => {
    const query = new SOQLQuery();
    query.select('Id', 'Name');
    expect(query.selectItems.includes('Id'));
    expect(query.selectItems.includes('Name'));
});

test('from() sets fromValue to sObject', () => {
    const sObject = 'Account';
    const query = new SOQLQuery();
    query.from(sObject)
    expect(query.fromValue).toBe(sObject);
});

test('where() adds field to whereItems', () => {
    const field = 'Id';
    const query = new SOQLQuery();
    query.where(field)
    expect(query.whereItems).toContain(field);
});

test('where() sets currentStatement to WHERE', () => {
    const field = 'Id';
    const query = new SOQLQuery();
    query.where(field)
    expect(query.currentStatement).toBe(Statements.WHERE);
});

test('equals() adds operand and "=" to whereItems when currentStatement = WHERE', () => {
    const field = 'Number_of_dogs__c'
    const operand = 5;
    const query = new SOQLQuery();
    query.where(field);
    query.equals(operand);
    expect(query.whereItems).toEqual([field, '=', operand.toString()]);
});

test('when currentStatement = WHERE equals() does not change whereItems', () => {
    const operand = 'Name';
    const query = new SOQLQuery();
    query.equals(operand);
    expect(query.whereItems.length).toBe(0);
});

test('equals() adds single quotes to operand if it\'s a string', () => {
    const operand = 'John';
    const query = new SOQLQuery()
                        .where('Name')
                        .equals(operand);
    const expectedOperand = `'${operand}'`;
    expect(query.whereItems.pop()).toBe(expectedOperand);
});

test('equals() converts operand to a string if it\'s a Date', () => {
    const operand = new Date('2000-01-01');
    const query = new SOQLQuery()
                        .where('CreatedDate')
                        .equals(operand);

    const expectedOperand = operand.toString();
    expect(query.whereItems.pop()).toBe(expectedOperand);
});

test('equals() converts operand to a string if it\'s null', () => {
    const operand = null;
    const query = new SOQLQuery()
                        .where('Color__c')
                        .equals(operand);

    const expectedOperand = 'null';
    expect(query.whereItems.pop()).toBe(expectedOperand);
});

test('notEquals() adds single quotes to operand if it\'s a string', () => {
    const operand = 'John';
    const query = new SOQLQuery()
                        .where('Name')
                        .notEquals(operand);
    const expectedOperand = `'${operand}'`;
    expect(query.whereItems.pop()).toBe(expectedOperand);
});

test('notEquals() converts operand to a string if it\'s a Date', () => {
    const operand = new Date('2000-01-01');
    const query = new SOQLQuery()
                        .where('CreatedDate')
                        .notEquals(operand);

    const expectedOperand = operand.toString();
    expect(query.whereItems.pop()).toBe(expectedOperand);
});

test('notEquals() converts operand to a string if it\'s null', () => {
    const operand = null;
    const query = new SOQLQuery()
                        .where('Color__c')
                        .notEquals(operand);

    const expectedOperand = 'null';
    expect(query.whereItems.pop()).toBe(expectedOperand);
});

test('limit() sets limitValue to value', () => {
    const value = 5;
    const query = new SOQLQuery()
                        .limit(value);

    expect(query.limitValue).toBe(value);
});

test('build() sets paramString and path', () => {
    const value = 5;
    const query = new SOQLQuery().select('Id', 'Name')
                                .from('Account')
                                .where('Name')
                                .equals('Umbrella Corp')
                                .limit(value)
                                .build();

    const expectedParamString = `SELECT+Id,Name+FROM+Account+WHERE+Name+=+'Umbrella%20Corp'+LIMIT+5`;
    const expectedPath = `${QUERY_PATH}${expectedParamString}`;
    expect(query.paramString).toBe(expectedParamString);
    expect(query.path).toBe(expectedPath);
});