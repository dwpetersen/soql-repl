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

describe('where()', () => {
    test('adds field to whereItems', () => {
        const field = 'Id';
        const query = new SOQLQuery();
        query.where(field)
        expect(query.whereItems).toContain(field);
    });
    
    test('sets currentStatement to WHERE', () => {
        const field = 'Id';
        const query = new SOQLQuery();
        query.where(field)
        expect(query.currentStatement).toBe(Statements.WHERE);
    });
});

describe('equals()', () => {
    test('adds operand and "=" to whereItems when currentStatement == WHERE', () => {
        const field = 'Number_of_dogs__c'
        const operand = 5;
        const query = new SOQLQuery();
        query.where(field);
        query.equals(operand);
        expect(query.whereItems).toEqual([field, '=', operand.toString()]);
    });
    
    test('when currentStatement != WHERE, whereItems are unchanged', () => {
        const operand = 'Name';
        const query = new SOQLQuery();
        query.equals(operand);
        expect(query.whereItems.length).toBe(0);
    });
    
    test('adds single quotes to operand if it\'s a string', () => {
        const operand = 'John';
        const query = new SOQLQuery()
                            .where('Name')
                            .equals(operand);
        const expectedOperand = `'${operand}'`;
        expect(query.whereItems.pop()).toBe(expectedOperand);
    });

    test('escapes single quotes if operand is a string', () => {
        //Given
        const operand = `O'Donnell's Whisky`;

        //When
        const query = new SOQLQuery()
                            .where('Name')
                            .equals(operand);
        
        //Then
        const expectedOperand = `'O\\'Donnell\\'s Whisky'`;
        expect(query.whereItems.pop()).toBe(expectedOperand);
    });

    test('escapes backslash if operand is a string', () => {
        //Given
        const operand = `C:\\Users`;

        //When
        const query = new SOQLQuery()
                            .where('Name')
                            .equals(operand);
        
        //Then
        const expectedOperand = `'C:\\\\Users'`;
        expect(query.whereItems.pop()).toBe(expectedOperand);
    });
    
    test('converts operand to a string if it\'s a Date', () => {
        const operand = new Date('2000-01-01');
        const query = new SOQLQuery()
                            .where('CreatedDate')
                            .equals(operand);
    
        const expectedOperand = operand.toString();
        expect(query.whereItems.pop()).toBe(expectedOperand);
    });
    
    test('converts operand to a string if it\'s null', () => {
        const operand = null;
        const query = new SOQLQuery()
                            .where('Color__c')
                            .equals(operand);
    
        const expectedOperand = 'null';
        expect(query.whereItems.pop()).toBe(expectedOperand);
    });
});

describe('notEquals()', () => {
    test('adds operand and "!=" to whereItems when currentStatement == WHERE', () => {
        //Given
        const field = 'Number_of_dogs__c';
        const operand = 5;
        const query = new SOQLQuery().select('Name', 'CreatedDate')
                                     .from('Account')
                                     .where(field);

        // When
        query.notEquals(operand);

        //Then
        const expectedWhereItems = [field, '!=', operand.toString()]
        expect(query.whereItems).toEqual(expectedWhereItems);
    });
    
    test('when currentStatement != WHERE, whereItems are unchanged', () => {
        //Given
        const operand = 5;
        const query = new SOQLQuery().select('Name', 'CreatedDate')
                                     .from('Account');
        const expectedWhereItems = [...query.whereItems];
        
        // When
        query.notEquals(operand);

        expect(query.whereItems).toEqual(expectedWhereItems);
    });
});

describe('lessThan()', () => {
    test('adds operand and "<" to whereItems when currentStatement == WHERE', () => {
        //Given
        const field = 'Number_of_dogs__c';
        const operand = 5;
        const query = new SOQLQuery().select('Name', 'CreatedDate')
                                     .from('Account')
                                     .where(field);

        // When
        query.lessThan(operand);

        //Then
        const expectedWhereItems = [field, '<', operand.toString()]
        expect(query.whereItems).toEqual(expectedWhereItems);
    });
    
    test('when currentStatement != WHERE, whereItems are unchanged', () => {
        //Given
        const operand = 5;
        const query = new SOQLQuery().select('Name', 'CreatedDate')
                                     .from('Account');
        const expectedWhereItems = [...query.whereItems];
        
        // When
        query.lessThan(operand);

        expect(query.whereItems).toEqual(expectedWhereItems);
    });
});

describe('lessOrEqual()', () => {
    test('adds operand and "<=" to whereItems when currentStatement == WHERE', () => {
        //Given
        const field = 'Number_of_dogs__c';
        const operand = 5;
        const query = new SOQLQuery().select('Name', 'CreatedDate')
                                     .from('Account')
                                     .where(field);

        // When
        query.lessOrEqual(operand);

        //Then
        const expectedWhereItems = [field, '<=', operand.toString()]
        expect(query.whereItems).toEqual(expectedWhereItems);
    });
    
    test('when currentStatement != WHERE, whereItems are unchanged', () => {
        //Given
        const operand = 5;
        const query = new SOQLQuery().select('Name', 'CreatedDate')
                                     .from('Account');
        const expectedWhereItems = [...query.whereItems];
        
        // When
        query.lessOrEqual(operand);

        expect(query.whereItems).toEqual(expectedWhereItems);
    });
});

describe('greaterThan()', () => {
    test('adds operand and ">" to whereItems when currentStatement == WHERE', () => {
        //Given
        const field = 'Number_of_dogs__c';
        const operand = 5;
        const query = new SOQLQuery().select('Name', 'CreatedDate')
                                     .from('Account')
                                     .where(field);

        // When
        query.greaterThan(operand);

        //Then
        const expectedWhereItems = [field, '>', operand.toString()]
        expect(query.whereItems).toEqual(expectedWhereItems);
    });
    
    test('when currentStatement != WHERE, whereItems are unchanged', () => {
        //Given
        const operand = 5;
        const query = new SOQLQuery().select('Name', 'CreatedDate')
                                     .from('Account');
        const expectedWhereItems = [...query.whereItems];
        
        // When
        query.greaterThan(operand);

        expect(query.whereItems).toEqual(expectedWhereItems);
    });
});

describe('greaterOrEqual()', () => {
    test('adds operand and ">=" to whereItems when currentStatement == WHERE', () => {
        //Given
        const field = 'Number_of_dogs__c';
        const operand = 5;
        const query = new SOQLQuery().select('Name', 'CreatedDate')
                                     .from('Account')
                                     .where(field);

        // When
        query.greaterOrEqual(operand);

        //Then
        const expectedWhereItems = [field, '>=', operand.toString()]
        expect(query.whereItems).toEqual(expectedWhereItems);
    });
    
    test('when currentStatement != WHERE, whereItems are unchanged', () => {
        //Given
        const operand = 5;
        const query = new SOQLQuery().select('Name', 'CreatedDate')
                                     .from('Account');
        const expectedWhereItems = [...query.whereItems];
        
        // When
        query.greaterOrEqual(operand);

        expect(query.whereItems).toEqual(expectedWhereItems);
    });
});

describe('in()', () => {
    test('adds IN operator and array string to whereItems', () => {
        //Given
        const field = 'Name';
        const operandArray = ['Hello', 'World'];
        
        //When
        const query = new SOQLQuery().select('Name', 'CreatedDate')
                                     .from('Account')
                                     .where(field)
                                     .in(...operandArray);
        
        //Then
        const expectedWhereItems = [field, 'IN', '(\'Hello\',\'World\')'];
        expect(query.whereItems).toEqual(expectedWhereItems);
    });

    test('when currentStatement != WHERE, whereItems are unchanged', () => {
        //Given
        const operandArray = ['Hello', 'World'];
        
        const query = new SOQLQuery().select('Name', 'CreatedDate')
                                     .from('Account');
        const expectedWhereItems = [...query.whereItems];
        
        //When
        query.in(...operandArray);
        
        //Then
        expect(query.whereItems).toEqual(expectedWhereItems);
    });
});

describe('notIn()', () => {
    test('adds NOT IN operator and array string to whereItems', () => {
        //Given
        const field = 'Name';
        const operandArray = ['Hello', 'World'];
        
        //When
        const query = new SOQLQuery().select('Name', 'CreatedDate')
                                     .from('Account')
                                     .where(field)
                                     .notIn(...operandArray);
        
        //Then
        const expectedWhereItems = [field, 'NOT IN', '(\'Hello\',\'World\')'];
        expect(query.whereItems).toEqual(expectedWhereItems);
    });

    test('when currentStatement != WHERE, whereItems are unchanged', () => {
        //Given
        const operandArray = ['Hello', 'World'];
        
        const query = new SOQLQuery().select('Name', 'CreatedDate')
                                     .from('Account');
        const expectedWhereItems = [...query.whereItems];
        
        //When
        query.notIn(...operandArray);
        
        //Then
        expect(query.whereItems).toEqual(expectedWhereItems);
    });
});

describe('like()', () => {
    test('adds operand and "LIKE" to whereItems when currentStatement == WHERE', () => {
        //Given
        const field = 'Name';
        const operand = 'Hello%';
        const query = new SOQLQuery().select('Name', 'CreatedDate')
                                     .from('Account')
                                     .where(field);

        // When
        query.like(operand);

        //Then
        const expectedWhereItems = [field, 'LIKE', `'${operand.toString()}'`];
        expect(query.whereItems).toEqual(expectedWhereItems);
    });
    
    test('when currentStatement != WHERE, whereItems are unchanged', () => {
        //Given
        const operand = 'Hello%';
        const query = new SOQLQuery().select('Name', 'CreatedDate')
                                     .from('Account');
        const expectedWhereItems = [...query.whereItems];
        
        // When
        query.like(operand);

        expect(query.whereItems).toEqual(expectedWhereItems);
    });
});

describe('includes()', () => {
    test('adds INCLUDES operator and array string to whereItems', () => {
        //Given
        const field = 'Industries__c';
        const operandArray = ['IT', 'Government'];
        
        //When
        const query = new SOQLQuery().select('Id','Name', 'Industries__c')
                                     .from('Account')
                                     .where(field)
                                     .includes(...operandArray);
        
        //Then
        const expectedWhereItems = [field, 'INCLUDES', '(\'IT\',\'Government\')'];
        expect(query.whereItems).toEqual(expectedWhereItems);
    });

    test('when currentStatement != WHERE, whereItems are unchanged', () => {
        //Given
        const operandArray = ['IT', 'Government'];
        
        const query = new SOQLQuery().select('Id','Name', 'Industries__c')
                                     .from('Account')
        const expectedWhereItems = [...query.whereItems];
        
        //When
        query.includes(...operandArray);
        
        //Then
        expect(query.whereItems).toEqual(expectedWhereItems);
    });
});

describe('excludes()', () => {
    test('adds EXCLUDES operator and array string to whereItems', () => {
        //Given
        const field = 'Industries__c';
        const operandArray = ['IT', 'Government'];
        
        //When
        const query = new SOQLQuery().select('Id','Name', 'Industries__c')
                                     .from('Account')
                                     .where(field)
                                     .excludes(...operandArray);
        
        //Then
        const expectedWhereItems = [field, 'EXCLUDES', '(\'IT\',\'Government\')'];
        expect(query.whereItems).toEqual(expectedWhereItems);
    });

    test('when currentStatement != WHERE, whereItems are unchanged', () => {
        //Given
        const operandArray = ['IT', 'Government'];
        
        const query = new SOQLQuery().select('Id','Name', 'Industries__c')
                                     .from('Account')
        const expectedWhereItems = [...query.whereItems];
        
        //When
        query.excludes(...operandArray);
        
        //Then
        expect(query.whereItems).toEqual(expectedWhereItems);
    });
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
    
    mockedGet.mockResolvedValue(response as AxiosResponse);

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
