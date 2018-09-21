const inquirer = require('inquirer');

/**
 * CLI function that completes user authorization.
 *
 * @param {WatneyApp} app
 */
module.exports = async function authCli(app) {
  const spotify = app.plugins.get('spotify');
  await spotify.init();

  console.log(`Go here to authorize Watney: ${spotify.authorizeUrl}`);

  const { resultUrl } = await inquirer.prompt({
    name: 'resultUrl',
    message: 'Paste the full URL you were redirected to:',
    validate: url => url.hostname === 'watney.local',
    filter: input => new URL(input)
  });

  const authorizationCode = resultUrl.searchParams.get('code');

  await spotify.authorize(authorizationCode);

  // TODO: Better test and/or messaging
  try {
    let devices = await spotify.api.getMyDevices();
    console.log(JSON.stringify(devices.body.devices, null, 2));
  } catch (error) {
    console.error(error);
  }
};
