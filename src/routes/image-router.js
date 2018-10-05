'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
const logger = require('../lib/logger');

const Image = require('../model/image-schema');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();


router.post('/image/upload', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'bad request'));
  }
  return new Image({
    ...request.body, // O(n)
    account: request.account._id,
    // development note:
    //   This validation can help ensure no one can mess
    //   with the account system
  }).save()
    .then(image => response.json(image))
    .catch(next);
});

router.get('/image/upload/:id', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  // test if bearer auth account was passed, if not reject image request attempt
  if (!request.account) {
    return next(new HttpError(400), 'not authorized.');
  }
  logger.log(logger.INFO, 'GET - /image/upload/([$id])');
  logger.log(logger.INFO, `Trying: ${request.params.id}`);
  return Image.findById(request.params.id)
  // mongoose resolves whether or not it can find this ID
    .then((image) => {
      if (image) {
        logger.log(logger.INFO, '200 - image found.');
        return response.json(image);
      }
      logger.log(logger.INFO, '404 - Image not found.');
      return next(new HttpError(404, 'Image not found.'));
    })
    .catch(next); // development note: mongoose will only reject in case of error
  // not finding an image is not considered an error
});

router.put('/image/upload/:id', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'PUT image requested');
  const toUpdate = {
    title: request.body.title,
    url: request.body.url,
  };
  if (toUpdate.title === undefined && toUpdate.url === undefined) {
    return response.status(404).send('No data given. Updated request rejected.');
  }
  return Image.findByIdAndUpdate(request.params.id,
    toUpdate, { new: true }, (error, putUpdate) => {
      if (error) {
        return response.status(401).send(error);
      }
      logger.log(logger.INFO, 'Image updated successful.');
      return response.json(putUpdate);
    })
    .catch(next);
});

router.delete('/image/upload/:id', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  return Image.findById(request.params.id)
    .then((image) => {
      if (!image) {
        logger.log(logger.INFO, 'Responding with a 404 status code');
        return next(new HttpError(404, 'could not find image to delete'));
      }
      return image.remove();
    })
    .then(() => {
      return response.sendStatus(204);
    })
    .catch(error => next(error));
});
