const creds = require('./creds.js');
const httpRequest = require('./httprequest.js');
const { SOQLQuery } = require('./query.js');

const getAccounts = async () => {
    const accountQuery = new SOQLQuery();
    accountQuery.select('Id','Name')
                .from('Account')
                .limit(5)
                .build();
    const path  = `/services/data/v55.0/query/?q=${accountQuery.queryParamString}`;
    //const request = httpRequest.buildGetRequest(creds.currentAlias, path);
    try {
        await checkCurrentToken();
        const request = httpRequest.buildGetRequest(creds.currentAlias, path);
        const response = await request;
        return response.data;
    }
    catch(error) {
        console.error(error);
    }
};

const isTokenExpired = (alias) => {
    return !alias.lastRequest || 
           Date.now() - alias.lastRequest > (1000*60*60);
}

const checkCurrentToken = async () => {
    let validToken = true;
    if (!creds.currentAlias.currentToken) {
        console.log(`Could not find currentToken for alias '${creds.currentAlias.name}'.`);
        validToken = false;
    }
    else if (isTokenExpired(creds.currentAlias)) {
        console.log(`Token has expired for alias '${creds.currentAlias.name}'.`);
        validToken = false;
    }
    if (!validToken) {
        console.log(`Setting currentToken...`);
        try {
            const token = await getAccessToken();
            creds.currentAlias.currentToken = token;
            creds.currentAlias.lastRequest = new Date();
            creds.saveAlias(creds.currentAlias);
        }
        catch (error) {
            throw error;
        }         
    }
};

const getAccessToken = async () => {
    const request = httpRequest.buildAccessTokenRequest(creds.currentAlias);
    try {
        const response = await request;
        return response.data.access_token;
    }
    catch(error) {
        throw error;
    }
};

/*getAccessToken()
    .then((token) => {
        console.log(token);
    })
    .catch((error) => {
        console.error(error);
    });*/

/*getAccounts()
    .then(accounts => {
        console.log(accounts);
    });*/

module.exports = {
    getAccessToken,
    getAccounts,
    checkCurrentToken
}