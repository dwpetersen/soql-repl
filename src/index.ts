import * as creds from './creds';
import * as httpRequest from './httprequest';
import { SOQLQuery, SOQLQueryResult } from './query'
import { settings } from './settings';

let currentAlias = creds.openAlias(settings.defaultAlias);

export const getAccounts = async (): Promise<SOQLQueryResult | undefined> => {
    const accountQuery = new SOQLQuery();
    accountQuery.select('Id','Name')
                .from('Account')
                .where('NumberofLocations__c')
                .equals(6)
                .limit(5)
                .build();
    console.log(accountQuery.paramString);
    try {
        await accountQuery.execute(currentAlias);
        return accountQuery.result;
    }
    catch(error) {
        console.error(error);
    }
};

