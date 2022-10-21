const JS_PATH = '../../../dist/'

const query = require(JS_PATH+'./query/query.js');
const auth = require('../auth.js');

const runQuery = async () => {
    let accountQuery = new query.SOQLQuery();
    accountQuery.select('Id','Name', 'Industries__c')
                .from('Account')
                .where('CreatedDate')
                .equals('LAST_90_DAYS')
                .limit(5)
                .build()
    await accountQuery.execute(auth.alias);
    return JSON.stringify(accountQuery.result, null, 2);
}

module.exports= {
    runQuery
}
