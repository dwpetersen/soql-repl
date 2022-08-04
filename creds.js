const fs = require('fs');
const httpRequest = require('./httprequest.js');

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

const getAccessToken = async (alias) => {
    const request = httpRequest.buildAccessTokenRequest(alias);
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

const checkCurrentToken = async (alias) => {
    let validToken = true;
    if (!alias.currentToken) {
        console.log(`Could not find currentToken for alias '${alias.name}'.`);
        validToken = false;
    }
    else if (isTokenExpired(alias)) {
        console.log(`Token has expired for alias '${alias.name}'.`);
        validToken = false;
    }
    if (!validToken) {
        console.log(`Setting currentToken...`);
        try {
            const token = await getAccessToken(alias);
            alias.currentToken = token;
            alias.lastRequest = new Date();
            saveAlias(alias);
        }
        catch (error) {
            throw error;
        }         
    }
};

module.exports = {
    openAlias,
    saveAlias,
    checkCurrentToken
};