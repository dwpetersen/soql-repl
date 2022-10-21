const LIB_DIR = '../../lib';
const runner = require(`${LIB_DIR}/run.js`);
const opportunity = require(`${LIB_DIR}/query/opportunity.js`);

runner.run(opportunity.runQuery);
