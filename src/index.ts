import * as creds from './creds';
import * as httpRequest from './httprequest';
import { SOQLQuery } from './query'
import { settings } from './settings';

let currentAlias = creds.openAlias(settings.defaultAlias);

export const getAccounts = async () => {
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

