'use strict';

const superagent = require('superagent');
const server = require('../lib/server');
// const imageMock = require('./lib/image-mock');
const authAccountMock = require('./lib/auth-account-mock');

const API_URL = `http://localhost:${process.env.PORT}/image/upload`;

describe('testing route: /image/upload', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(authAccountMock.pCleanAuthAccountMocks);

  test('should respond with 200 status code and a picture', () => {
    return authAccountMock.pCreateMock()
      .then((mock) => {
        return superagent.post(API_URL)
          .set('Authorization', `Bearer ${mock.token}`)
          .field('title', 'Sir Gregor, the mountain that purrs and BANANA')
          .attach('picture', `${__dirname}/assets/gregor.jpg`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
      });
  });
});
