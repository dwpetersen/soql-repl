import * as httpRequest from '../httprequest';
import { Alias } from '../creds';
import { ERROR_PATH_MUST_BE_SET, QUERY_PATH, SOQLQuery, Statements } from '../query';
import { AxiosResponse } from 'axios';

jest.mock('../httprequest');

const mockedGet = httpRequest.get as jest.Mock;

const alias: Alias = {
    name: 'test',
    url: 'https://test-domain.my.salesforce.com',
    clientId: 'clientId123',
    clientSecret: 'clientSecret123',
    username: 'test@example.com',
    password: 'password123!',
    securityToken: 'securityToken123',
    currentToken: 'currentToken123'
}

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

test('execute() returns response when path is set', async () => {
    const query = new SOQLQuery().select('Id', 'Name')
                                 .from('Account')
                                 .limit(5)
                                 .build();
    const response = { 
        data: {
            "totalSize": 1,
            "done": true,
            "records": [
                {
                "attributes": {
                    "type": "Account",
                    "url": "/services/data/v55.0/sobjects/Account/0015i00000MLQoqAAH"
                },
                "Id": "0015i00000MLQoqAAH",
                "Name": "Burlington Textiles Corp of America"
                }
            ]
        }
    };
    
    mockedGet.mockResolvedValue(response as AxiosResponse<any>);

    await query.execute(alias);
    expect(query.result).toEqual(response.data);
});

test('execute() returns an error when path is not set', async () => {
    const query = new SOQLQuery().select('Id', 'Name')
                                 .from('Account')
                                 .limit(5);
    expect.assertions(1);
    try {
        await query.execute(alias);
    }
    catch (err) {
        expect(err).toEqual(new Error(ERROR_PATH_MUST_BE_SET))
    }
});
