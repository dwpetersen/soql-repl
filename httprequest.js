const axios = require('axios');
const creds = require('./creds.js');

const getDefaultHeaders = alias => {
    return {
        'Authorization': `Bearer ${alias.currentToken}`,
        'Accept': 'application/json'
    }
}

const buildFormData = (alias) => {
    const data = {
        grant_type: 'password',
        client_id: alias.clientId,
        client_secret: alias.clientSecret,
        username: alias.username,
        password: alias.password + alias.securityToken
    }

    const formData = Object.keys(data).map(key => {
        return encodeURI(key) + '=' + encodeURI(data[key]);
    }).join('&');

    return formData;
}

const get = async (alias, path, headers) => {
    const defaultHeaders = getDefaultHeaders(alias);
    const config = {
        baseURL: alias.url,
        headers: { ...defaultHeaders, ...headers }
    }
    await checkCurrentToken(alias)
    return axios.get(path, config);
}

const getAccessToken = async (alias) => {
    try {
        const url = 'https://login.salesforce.com/services/oauth2/token';
        const data = buildFormData(alias);

        const response = await axios.post(url, data);
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
            creds.saveAlias(alias);
        }
        catch (error) {
            throw error;
        }         
    }
};

module.exports = {
    get
};