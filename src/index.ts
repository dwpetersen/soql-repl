import * as creds from './creds';
import { SOQLQuery, SOQLQueryResult } from './query'
import { settings } from './settings';

const currentAlias = creds.openAlias(settings.defaultAlias);

export const getAccounts = async (): Promise<SOQLQueryResult | undefined> => {
    const accountQuery = new SOQLQuery();
    accountQuery.select('Id','Name')
                .from('Account')
                .where('Name')
                .equals('Burlington Textiles Corp of America')
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

