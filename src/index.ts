import * as creds from './creds';
import * as httpRequest from './httprequest';
import { SOQLQuery, SOQLQueryResult } from './query'
import { settings } from './settings';

let currentAlias = creds.openAlias(settings.defaultAlias);

export const getAccounts = async (): Promise<SOQLQueryResult | undefined> => {
    const accountQuery = new SOQLQuery();
    accountQuery.select('Id','Name')
                .from('Account')
                .limit(5)
                .build();
    try {
        await accountQuery.execute(currentAlias);
        return accountQuery.result;
    }
    catch(error) {
        console.error(error);
    }
};

