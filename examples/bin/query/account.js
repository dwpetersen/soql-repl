const LIB_DIR = '../../lib';
const runner = require(`${LIB_DIR}/run.js`);

const account = require(`${LIB_DIR}/query/account.js`);

const query = account.getQuery();
console.log(`Query: '${query.toString()}'`);
console.log(`Path: '${query.path}'`);
runner.run(account.runQuery);

