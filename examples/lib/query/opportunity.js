const JS_PATH = '../../../dist'

const query = require(`${JS_PATH}/query/query.js`);
const auth = require('../auth.js');

const runQuery = async () => {
    let oppQuery = new query.SOQLQuery();
    oppQuery.select('Id','Name','Amount')
            .from('Opportunity')
            .where('StageName')
            .in('Closed Won', 'Prospecting')
            .limit(5)
            .build();
    await oppQuery.execute(auth.alias);
    return JSON.stringify(oppQuery.result, null, 2);
}

module.exports= {
    runQuery
}
