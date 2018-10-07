'use strict';

const fs = require('fs-extra');
const aws = require('aws-sdk');

const amazonS3 = new aws.S3();

const s3 = {};

s3.pUpload = (path, key) => {
  const uploadOptions = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fs.createReadStream(path),
  };

  return amazonS3.upload(uploadOptions)
    .promise()
    .then((response) => {
      return fs.remove(path)
        .then(() => response.Location)
        .catch(error => Promise.reject(error));
    });
};

s3.pRemove = (key) => {
  const removeOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET,
  };
  return amazonS3.deleteObject(removeOptions).promise();
};

module.exports = s3;
