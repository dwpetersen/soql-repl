const JS_PATH = '../../../dist'

const query = require(`${JS_PATH}/query/query.js`);
const auth = require('../auth.js');

const alias = auth.alias;

const getAllFieldsQuery = () => {
    let accountQuery = new query.SOQLQuery();
    accountQuery.select('FIELDS(ALL)')
                .from('Account')
                .where('Id')
                .notEquals(null)
                .limit(10)
                .build();
    return accountQuery;
}

const getQuery = () => {
    let accountQuery = new query.SOQLQuery();
    accountQuery.select('Id', 'Name', 'Active__c')
                .from('Account')
                .where('CreatedDate')
                .equals('LAST_90_DAYS')
                .limit(5)
                .build();
    return accountQuery;
}

const runQuery = async () => {
    let accountQuery = getQuery();
    await accountQuery.execute(alias);
    return JSON.stringify(accountQuery.result, null, 2);
}

module.exports = {
    alias,
    getAllFieldsQuery,
    getQuery,
    runQuery
}
