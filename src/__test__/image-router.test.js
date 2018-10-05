'use strict';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');
// const imageMock = require('./lib/image-mock');
const authAccountMock = require('./lib/auth-account-mock');

const API_URL = `http://localhost:${process.env.PORT}/image/upload`;

describe('testing route /image/upload', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  // beforeEach(authAccountMock.pCleanAuthAccountMocks);

  test('test - post request with a valid body and token should return 200', () => {
    return authAccountMock.pCreateMock()
      .then((mock) => {
        return superagent.post(API_URL)
          .set('Authorization', `Bearer ${mock.token}`)
          .send({
            title: faker.lorem.words(3),
            url: faker.internet.url(),
            // account: mock.account._id.toString(),
            // development note: the account id will be tied by the route itself
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
      });
  });
  test('test - on post, if no token was provided, should return 401', () => {
    return authAccountMock.pCreateMock()
      .then(() => {
        return superagent.post(API_URL)
          // .set('Authorization', `Bearer ${mock.token}`)
          .send({
            title: faker.lorem.words(3),
            url: faker.internet.url(),
            // account: mock.account._id.toString(),
            // development note: the account id will be tied by the route itself
          });
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(401);
      });
  });
  test('test - on post, if no body was provided or if the body was invalid should return 400', () => {
    return authAccountMock.pCreateMock()
      .then((mock) => {
        return superagent.post(API_URL)
          .set('Authorization', `Bearer ${mock.token}`)
          .send({
            title: faker.lorem.words(3),
            // account: mock.account._id.toString(),
            // development note: the account id will be tied by the route itself
          });
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
});
