const inquirer = require('inquirer');
const authCli = require('./auth');

module.exports = async function spotifyCli(app) {
  let answers = await inquirer.prompt([
    {
      name: 'command',
      message: 'What would you like to do?',
      type: 'list',
      choices: [
        {
          name: 'Authorize this app to use your Spotify account',
          value: authCli
        }
      ]
    }
  ]);

  await answers.command(app);
};
