const JS_PATH = '../../dist/'

const query = require(JS_PATH+'./query/query.js');
const alias = require('./alias.js');

const runQuery = async () => {
    let accountQuery = new query.SOQLQuery();
    accountQuery.select('Id','Name', 'Industries__c')
                .from('Account')
                .where('CreatedDate')
                .equals('LAST_90_DAYS')
                .limit(5)
                .build()
    await accountQuery.execute(alias.alias);
    return JSON.stringify(accountQuery.result, null, 2);
}

const run = async () => {
    return await runQuery();
}


const handleThen = (data) => {
    console.log(data);
}

const handleCatch = (err) => {
    if (err.response) {
        console.error(err.response.data);
    }
    else {
        console.error(err);
    }  
}

run().then(handleThen).catch(handleCatch);

module.exports= {
    run,
    runQuery
}
