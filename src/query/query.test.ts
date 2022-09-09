import * as httpRequest from '../httprequest';
import { Alias } from '../auth/creds';
import { ERROR_PATH_MUST_BE_SET, QUERY_PATH, SOQLQuery, Statements } from './query';
import { FieldExpression } from './field-expression';
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
    test('adds new FieldExpression to whereItems', () => {
        // Given
        const field = 'Id';
        const query = new SOQLQuery();

        // When
        query.where(field)

        // Then
        const expectedValue = new FieldExpression(field);
        expect(query.whereItems.pop()).toEqual(expectedValue);
    });
    
    test('sets currentStatement to WHERE', () => {
        // Given
        const field = 'Id';
        const query = new SOQLQuery();

        // When
        query.where(field)

        // Then
        expect(query.currentStatement).toBe(Statements.WHERE);
    });
});

describe('equals()', () => {
    test('sets operand and "=" on last FieldExpression in whereItems when currentStatement == WHERE', () => {
        // Given
        const field = 'Number_of_dogs__c'
        const operand = 5;
        const query = new SOQLQuery().where(field);

        // When
        query.equals(operand);

        // Then
        const expectedValue = new FieldExpression(field);
        expectedValue.operand = operand;
        expectedValue.operator = '='
        expect(query.whereItems.pop()).toEqual(expectedValue);
    });
    
    test('when currentStatement != WHERE, whereItems is unchanged', () => {
        // Given
        const operand = 'Name';
        const query = new SOQLQuery();

        // When
        query.equals(operand);

        // Then
        expect(query.whereItems.length).toBe(0);
    });
});

describe('notEquals()', () => {
    test('sets operand and "!=" on last FieldExpression in whereItems  when currentStatement == WHERE', () => {
        //Given
        const field = 'Number_of_dogs__c';
        const operand = 5;
        const query = new SOQLQuery().select('Name', 'CreatedDate')
                                     .from('Account')
                                     .where(field);

        // When
        query.notEquals(operand);

        //Then
        const fieldExp = query.whereItems.pop() as FieldExpression;
        expect(fieldExp.operator).toBe('!=');
        expect(fieldExp.operand).toBe(operand);
    });
    
    test('when currentStatement != WHERE, whereItems is unchanged', () => {
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

        // Then
        const fieldExp = query.whereItems.pop() as FieldExpression;
        expect(fieldExp.operator).toBe('<');
        expect(fieldExp.operand).toBe(operand);
    });
    
    test('when currentStatement != WHERE, whereItems is unchanged', () => {
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
        const fieldExp = query.whereItems.pop() as FieldExpression;
        expect(fieldExp.operator).toBe('<=');
        expect(fieldExp.operand).toBe(operand);
    });
    
    test('when currentStatement != WHERE, whereItems is unchanged', () => {
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

        // Then
        const fieldExp = query.whereItems.pop() as FieldExpression;
        expect(fieldExp.operator).toBe('>');
        expect(fieldExp.operand).toBe(operand);
    });
    
    test('when currentStatement != WHERE, whereItems is unchanged', () => {
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
        const fieldExp = query.whereItems.pop() as FieldExpression;
        expect(fieldExp.operator).toBe('>=');
        expect(fieldExp.operand).toBe(operand);
    });
    
    test('when currentStatement != WHERE, whereItems is unchanged', () => {
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
        const fieldExp = query.whereItems.pop() as FieldExpression;
        expect(fieldExp.operator).toBe('IN');
        expect(fieldExp.operand).toEqual(operandArray);
    });

    test('when currentStatement != WHERE, whereItems is unchanged', () => {
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
        const fieldExp = query.whereItems.pop() as FieldExpression;
        expect(fieldExp.operator).toBe('NOT IN');
        expect(fieldExp.operand).toEqual(operandArray);
    });

    test('when currentStatement != WHERE, whereItems is unchanged', () => {
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
        const fieldExp = query.whereItems.pop() as FieldExpression;
        expect(fieldExp.operator).toBe('LIKE');
        expect(fieldExp.operand).toBe(operand);
    });
    
    test('when currentStatement != WHERE, whereItems is unchanged', () => {
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
        const fieldExp = query.whereItems.pop() as FieldExpression;
        expect(fieldExp.operator).toBe('INCLUDES');
        expect(fieldExp.operand).toEqual(operandArray);
    });

    test('when currentStatement != WHERE, whereItems is unchanged', () => {
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
        const fieldExp = query.whereItems.pop() as FieldExpression;
        expect(fieldExp.operator).toBe('EXCLUDES');
        expect(fieldExp.operand).toEqual(operandArray);
    });

    test('when currentStatement != WHERE, whereItems is unchanged', () => {
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

describe('and()', () => {
    test('if currentStatement == WHERE, adds "AND" and new FieldExpression to whereItems', () => {
        //Given
        const field = 'Industry';
        const query = new SOQLQuery().select('Id', 'Name')
                                     .from('Account')
                                     .where('Name')
                                     .like('Edge%');

        //When
        query.and(field);

        //Then
        const expectedItem = new FieldExpression(field)
        expect(query.whereItems.pop()).toEqual(expectedItem);
        expect(query.whereItems.pop()).toBe('AND');
    });

    test('if currentStatement != WHERE, whereItems is unchanged', () => {
        //Given
        const field = 'Industry';
        const query = new SOQLQuery().select('Id', 'Name')
                                     .from('Account')
        const expectedWhereItems = [...query.whereItems];

        //When
        query.and(field);

        //Then
        expect(query.whereItems).toEqual(expectedWhereItems);
    });
});

describe('or()', () => {
    test('if currentStatement == WHERE, adds "OR" and field to whereItems', () => {
        //Given
        const field = 'Industry';
        const query = new SOQLQuery().select('Id', 'Name')
                                     .from('Account')
                                     .where('Name')
                                     .like('Edge%');

        //When
        query.or(field);

        //Then
        const expectedItem = new FieldExpression(field)
        expect(query.whereItems.pop()).toEqual(expectedItem);
        expect(query.whereItems.pop()).toBe('OR');
    });

    test('if currentStatement != WHERE, whereItems is unchanged', () => {
        //Given
        const field = 'Industry';
        const query = new SOQLQuery().select('Id', 'Name')
                                     .from('Account')
        const expectedWhereItems = [...query.whereItems];

        //When
        query.or(field);

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
