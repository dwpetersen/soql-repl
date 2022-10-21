const JS_PATH = '../../dist/'

const query = require(JS_PATH+'./query/query.js');
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
