const LIB_DIR = '../../lib';
const runner = require(`${LIB_DIR}/run.js`);
const opportunity = require(`${LIB_DIR}/query/opportunity.js`);

const oppQuery = opportunity.getQuery();
console.log(`Query: '${oppQuery.toString()}'`);
console.log(`Path: '${oppQuery.path}'`);
runner.run(opportunity.runQuery, oppQuery);
