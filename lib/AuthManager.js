const { scheduleJob } = require('node-schedule');
const AccessToken = require('./AccessToken');
const RefreshToken = require('./RefreshToken');

const SCOPES = [
  'playlist-read-private',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state'
];

module.exports = class AuthManager {
  constructor(spotifyApi, db) {
    this.api = spotifyApi;
    this.db = db;

    this.init();
  }

  get authorizeUrl() {
    return this.api.createAuthorizeURL(SCOPES, null, true);
  }

  get accessToken() {
    return this.api.getAccessToken();
  }

  get refreshToken() {
    return this.api.getRefreshToken();
  }

  set accessToken(token) {
    if (!token) {
      return;
    }

    this.api.setAccessToken(token.value);

    this.accessTokenCollection.removeDataOnly(); // We only ever need the latest token.
    this.accessTokenCollection.insert(token);

    if (token.expirationDate) {
      if (token.expirationDate.getTime() <= Date.now()) {
        this.refreshAccessToken();
      } else {
        scheduleJob(token.expirationDate, this.refreshAccessToken);
      }
    }
  }

  set refreshToken(token) {
    if (!token) {
      return;
    }

    this.api.setRefreshToken(token.value);

    this.refreshTokenCollection.removeDataOnly(); // We only ever need the latest token.
    this.refreshTokenCollection.insert(token);
  }

  get accessTokenCollection() {
    let accessTokens = this.db.getCollection('accessTokens');
    if (!accessTokens) {
      this.db.addCollection('accessTokens');
      accessTokens = this.db.getCollection('accessTokens');
    }
    return accessTokens;
  }

  get refreshTokenCollection() {
    let refreshTokens = this.db.getCollection('refreshTokens');
    if (!refreshTokens) {
      this.db.addCollection('refreshTokens');
      refreshTokens = this.db.getCollection('refreshTokens');
    }
    return refreshTokens;
  }

  async authorize(authorizationCode) {
    try {
      const { body } = await this.api.authorizationCodeGrant(authorizationCode);
      this.accessToken = new AccessToken(body.access_token, body.expires_in);
      this.refreshToken = new RefreshToken(body.refresh_token);
    } catch (error) {
      // TODO: Figure out logging.
      // this.logger.log(error);
    }
  }

  init() {
    let { accessToken, refreshToken } = this.getTokensFromDb();

    if (!(accessToken && refreshToken)) {
      // TODO: Log (somehow)? Throw and catch up the chain?
    }

    // Assign refresh token first, since it may be needed to refresh the access token.
    this.refreshToken = refreshToken;
    this.accessToken = accessToken;
  }

  async refreshAccessToken() {
    let response;
    try {
      response = await this.api.refreshAccessToken();
    } catch (error) {
      this.logger.log(error);
      return;
    }

    this.accessToken = new AccessToken(
      response.access_token,
      response.expires_in
    );

    if (response.refresh_token) {
      this.refreshToken = new RefreshToken(response.refresh_token);
    }
  }

  getTokensFromDb() {
    let accessTokenRecord = this.accessTokenCollection.findOne();
    let refreshTokenRecord = this.refreshTokenCollection.findOne();

    return {
      accessToken: accessTokenRecord
        ? new AccessToken(
            accessTokenRecord.value,
            accessTokenRecord.expirationDate
          )
        : null,
      refreshToken: refreshTokenRecord
        ? new RefreshToken(refreshTokenRecord.value)
        : null
    };
  }
};
