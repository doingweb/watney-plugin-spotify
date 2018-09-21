module.exports = class AccessToken {
  /**
   * Creates an instance of AccessToken.
   * @param {string} value The access token granted in the OAuth exchange.
   * @param {number|string} expiration Either the number of seconds in which the
   *  access token will expire or an ISO string representation of the expiration date.
   */
  constructor(value, expiration) {
    if (
      !(
        value &&
        typeof value === 'string' &&
        (typeof expiration === 'number' || typeof expiration === 'string')
      )
    ) {
      throw new Error();
    }

    this.value = value;
    this.expirationDate = new Date(
      typeof expiration === 'number'
        ? Date.now() + expiration * 1000
        : new Date(expiration).getTime() // Seconds to milliseconds
    );
  }
};
