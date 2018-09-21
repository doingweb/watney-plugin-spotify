module.exports = class RefreshToken {
  /**
   * Creates an instance of RefreshToken.
   * @param {string} value The refresh token granted in the OAuth exchange.
   */
  constructor(value, expiration) {
    if (!(value && typeof value === 'string')) {
      throw new Error();
    }

    this.value = value;
  }
};
