const LIB_DIR = '../../lib';
const runner = require(`${LIB_DIR}/run.js`);

const account = require(`${LIB_DIR}/query/account.js`);

runner.run(account.runQuery);

