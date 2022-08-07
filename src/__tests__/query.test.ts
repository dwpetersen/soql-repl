import { SOQLQuery } from '../query'

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