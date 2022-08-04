const axios = require('axios');

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

const buildAccessTokenRequest = (alias) => {
    const url = 'https://login.salesforce.com/services/oauth2/token';
    const data = buildFormData(alias);

    return axios.post(url, data)
                .then({});
}

const buildGetRequest = (alias, path, headers) => {
    //const url = alias.url + path;
    const defaultHeaders = getDefaultHeaders(alias);
    const config = {
        baseURL: alias.url,
        headers: { ...defaultHeaders, ...headers }
    }

    return axios.get(
        path,
        config
    );
}

module.exports = {
    buildAccessTokenRequest,
    buildGetRequest
};