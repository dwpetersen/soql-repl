const LIB_DIR = '../../lib';
const runner = require(`${LIB_DIR}/run.js`);

const account = require(`${LIB_DIR}/query/account.js`);

const accountQuery = account.getQuery();
console.log(`Query: '${accountQuery.toString()}'`);
console.log(`Path: '${accountQuery.path}'`);
runner.run(account.runQuery, accountQuery);
