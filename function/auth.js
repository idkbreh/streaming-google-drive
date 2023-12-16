const { JWT } = require('google-auth-library');
const credentials = require('../database/creden.json');

async function authenticateWithGoogle() {
  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  await client.authorize();
  // console.log("Authentication success");
  return client;
}

module.exports = {
  authenticateWithGoogle,
};
