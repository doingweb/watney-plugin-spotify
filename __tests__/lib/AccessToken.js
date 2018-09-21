const AccessToken = require('../../lib/AccessToken');

let fakeNow, dateMock;

beforeEach(() => {
  fakeNow = 946684800000; // 2000-01-01T00:00:00.000Z
  dateMock = jest.spyOn(Date, 'now').mockReturnValue(fakeNow);
});

afterEach(() => {
  dateMock.mockRestore();
});

it('should set the token directly', () => {
  let result = new AccessToken('expected-token', 0);

  expect(result.value).toBe('expected-token');
});

it('should set the expiration date to now + expiration seconds', () => {
  let result = new AccessToken('value', 123);

  expect(result.expirationDate).toBeInstanceOf(Date);
  expect(result.expirationDate.getTime()).toBe(fakeNow + 123000);
});

it('should set the expiration date to an ISO date string', () => {
  let result = new AccessToken('value', '2000-01-01T00:00:10.000Z'); // 10 seconds after fakeNow

  expect(result.expirationDate).toBeInstanceOf(Date);
  expect(result.expirationDate.getTime()).toBe(fakeNow + 10000);
});
