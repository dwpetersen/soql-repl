const JS_PATH = '../../../dist'

const query = require(`${JS_PATH}/query/query.js`);
const auth = require('../auth.js');

const alias = auth.alias;

const getQuery = () => {
    let oppQuery = new query.SOQLQuery();
    oppQuery.select('Id','Name','Amount')
        .from('Opportunity')
        .where('StageName')
        .in('Closed Won', 'Prospecting')
        .limit(2)
        .build();
    return oppQuery;
}

const runQuery = async (oppQuery) => {
    await oppQuery.execute(auth.alias);
    return JSON.stringify(oppQuery.result, null, 2);
}

module.exports = {
    alias,
    getQuery,
    runQuery
}

