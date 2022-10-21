const JS_PATH = '../../../dist'

const query = require(`${JS_PATH}/query/query.js`);
const auth = require('../auth.js');

const alias = auth.alias;

const getQuery = () => {
    let accountQuery = new query.SOQLQuery();
    accountQuery.select('FIELDS(ALL)')
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
    getQuery,
    runQuery
}
