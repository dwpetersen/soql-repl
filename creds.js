const fs = require('fs');
const { settings } = require('./settings.js');

const CREDS_PATH = 'creds';

const openAlias = (aliasName) => {
    const aliasFile = fs.readFileSync(`${CREDS_PATH}/${aliasName}.json`);
    const alias = JSON.parse(aliasFile);
    alias.lastRequest = alias.lastRequest ? new Date(alias.lastRequest) : undefined;
    return alias;
} 

const saveAlias = (alias) => {
    console.log(alias);
    fs.writeFileSync(`${CREDS_PATH}/${alias.name}.json`, JSON.stringify(alias, null, 4));
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

const isTokenExpired = (alias) => {
    return !alias.lastRequest || 
           Date.now() - alias.lastRequest > (1000*60*60);
}

const checkCurrentToken = async () => {
    let validToken = true;
    if (!currentAlias.currentToken) {
        console.log(`Could not find currentToken for alias '${currentAlias.name}'.`);
        validToken = false;
    }
    else if (isTokenExpired(creds.currentAlias)) {
        console.log(`Token has expired for alias '${currentAlias.name}'.`);
        validToken = false;
    }
    if (!validToken) {
        console.log(`Setting currentToken...`);
        try {
            const token = await getAccessToken();
            creds.currentAlias.currentToken = token;
            creds.currentAlias.lastRequest = new Date();
            creds.saveAlias(currentAlias);
        }
        catch (error) {
            throw error;
        }         
    }
};

let currentAlias = openAlias(settings.defaultAlias);

module.exports = {
    currentAlias,
    saveAlias
};