const SpotifyWebApi = require('spotify-web-api-node');
const { WatneyPlugin } = require('watney-app');
const AuthManager = require('./lib/AuthManager');

// TODO: Sprinkle some logging in here.
module.exports = class SpotifyPlugin extends WatneyPlugin {
  static get id() {
    return 'spotify';
  }

  static get description() {
    return 'Plugin for Spotify.';
  }

  static get cli() {
    return require('./cli');
  }

  constructor(config) {
    super(config);

    const { clientId, clientSecret } = this.config;

    if (!(clientId && clientSecret)) {
      throw new Error(
        'The Spotify plugin requires the Client ID and Client Secret to be configured.'
      );
    }

    this.api = new SpotifyWebApi({
      clientId,
      clientSecret,
      redirectUri: 'https://watney.local/auth/'
    });

    this.logger.log('Plugin has been constructed.');
  }

  async init() {
    await super.init();

    this._authManager = new AuthManager(this.api, await this.db);
  }

  get authorizeUrl() {
    return this._authManager.authorizeUrl;
  }

  async authorize(authorizationCode) {
    await this._authManager.authorize(authorizationCode);
  }
};
