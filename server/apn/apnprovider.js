require('dotenv').config();
var path = require('path')
var apn = require('apn')

// sandbox or production APN service
const apnProduction = process.env.NODE_ENV === 'production'
  ? true
  : false;

// configuring APN with credentials
const apnOptions = {
  token: {
    key: path.join(__dirname, '..','apn', 'certs', 'AuthKey_LHH288KQLG.p8'),
    keyId: process.env.APN_KEY_ID,
    teamId: process.env.APN_TEAM_ID
  },
  production: true
};

console.log(apnOptions.token.key)
var apnProvider = new apn.Provider(apnOptions);

module.exports = apnProvider;