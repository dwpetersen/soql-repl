const creds = require('./creds.js');
const httpRequest = require('./httprequest.js');
import { SOQLQuery } from './query'
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
        const response = await httpRequest.get(currentAlias, path);
        return response.data;
    }
    catch(error) {
        console.error(error);
    }
};

module.exports = {
    getAccounts
}
