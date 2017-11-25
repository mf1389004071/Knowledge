/**
 * Created by wuhao on 2017/2/12.
 */
import qs from 'qs';
import request from 'superagent';

const axios = require('axios');

exports.AuthPlugin = function (appRemote, clientId, clientSecret, authServerRemote, ucenterServerRemote) {
  const searchParamsStr = document.location.search;
  if (searchParamsStr) {
    const code = searchParamsStr.split('&')[0].split('=')[1];
    const requestParams = {
      clientId,
      clientSecret,
      redirectUri: appRemote,
      code
    };
    /* eslint-disable max-len*/
    axios.post(`${ucenterServerRemote}/api/ucenter/access_token?code=${requestParams.code}&client_id=${requestParams.clientId}&redirect_uri=${requestParams.redirectUri}&client_secret=${requestParams.clientSecret}`, qs.stringify(requestParams)).then(({
      data
    }) => {
      localStorage.access_token = data.data.access_token;
      localStorage.user = JSON.stringify(data.data.user);
      window.location.href = appRemote;
    });
  } else if (localStorage.access_token === 'undefined' || !localStorage.access_token) {
    location.href = `${authServerRemote}/auth/ticket?redirect_uri=${appRemote}&client_id=${clientId}`;
  }
};
