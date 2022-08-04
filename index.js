const creds = require('./creds.js');
const httpRequest = require('./httprequest.js');
const { SOQLQuery } = require('./query.js');
const { settings } = require('./settings.js');

let currentAlias = creds.openAlias(settings.defaultAlias);

const getAccounts = async () => {
    const accountQuery = new SOQLQuery();
    accountQuery.select('Id','Name')
                .from('Account')
                .limit(5)
                .build();
    const path  = `/services/data/v55.0/query/?q=${accountQuery.queryParamString}`;
    try {
        await creds.checkCurrentToken(currentAlias);
        const request = httpRequest.buildGetRequest(currentAlias, path);
        const response = await request;
        return response.data;
    }
    catch(error) {
        console.error(error);
    }
};

module.exports = {
    getAccounts
}