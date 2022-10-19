const JS_PATH = '../../dist/';
const creds = require(JS_PATH+'/auth/creds.js');
const settings = require(JS_PATH+'/settings.js');

export alias = creds.openAlias(settings.defaultAlias);


