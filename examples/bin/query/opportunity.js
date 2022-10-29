const LIB_DIR = '../../lib';
const runner = require(`${LIB_DIR}/run.js`);
const opportunity = require(`${LIB_DIR}/query/opportunity.js`);

const query = opportunity.getQuery();
console.log(`Query: '${query.toString()}'`);
console.log(`Path: '${query.path}'`);
runner.run(opportunity.runQuery);
