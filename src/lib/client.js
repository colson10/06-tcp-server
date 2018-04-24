'use strict';

const uuid = require('uuid/v1');
const faker = require('faker');

module.exports = class Client {
  constructor(socket) {
    this.nickname = faker.internet.userName();
    this.user = uuid('uuid/v1');
    this.socket = socket;
  }
};
