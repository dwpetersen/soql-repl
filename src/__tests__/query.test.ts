import { SOQLQuery, Statements } from '../query'

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

