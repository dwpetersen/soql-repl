const axios = require('axios');
const creds = require('./creds.js');

const TOKEN_TIMEOUT_MINS = 60;

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

const retry = async (request, params, retries) => {
    return new Promise( async (resolve, reject) => {
        let count = 0;
        let success = false;
        while (count < retries && !success) {
            try {
                const response = await request(...params);
                success = true;
                resolve(response);
            }
            catch (err) {
                if (!err.request) {
                    reject(err);
                }
            }

            count++;
        }

        reject(`Could not complete request. Maximum retries reached (${retries}).`);
    });
}

const get = async (alias, path, headers) => {
    const defaultHeaders = getDefaultHeaders(alias);
    const config = {
        baseURL: alias.url,
        headers: { ...defaultHeaders, ...headers }
    }

    const params = [path, config];

    await checkCurrentToken(alias);
    const retryPromise = retry(axios.get, params, 3);
    
    return new Promise((resolve) => {
        retryPromise.then((response) => {
            alias.lastRequest = new Date();
            creds.saveAlias(alias);
            resolve(response);
        });
    });
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
           Date.now() - alias.lastRequest > (1000*60*TOKEN_TIMEOUT_MINS);
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