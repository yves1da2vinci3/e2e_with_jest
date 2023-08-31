// ./app.test.ts

import { testDB } from './src/config/db';
import request from 'supertest';
import app from './src/app';
import { faker } from '@faker-js/faker';

const username = faker.internet.userName(); //Creating a random username
const recipient = faker.internet.userName(); //Creating a random recipient
const password = faker.internet.password(); //Creating a random password

describe('Testing the express route', () => {
  beforeAll(async () => {
    await testDB().catch(err => {
      console.log('err', err.message);
    });
  }, 30000);

  describe('Testing the signup route', () => {
    //Testing the signup route
    test('successful signup test', async () => {
      //Testing the successful signup
      await request(app)
        .post('/api/signup')
        .send({ username, password }) //Sending the username and password in the request body
        .then(res => {
          expect(res.status).toBe(201); //Checking if the status code is 201
        });
      await request(app)
        .post('/api/signup')
        .send({
          username: recipient,
          password
        }) //Sending the username and password in the request body for the second user
        .then(res => {
          expect(res.status).toBe(201); //Checking if the status code is 201
        });
    });
    test('failed signup test', async () => {
      //Testing the failed signup
      await request(app)
        .post('/api/signup')
        .send({}) //Sending an empty request body
        .then(res => {
          expect(res.status).toBe(400); //Checking if the status code is 400
        });
    });
  });

  describe('Testing the login route', () => {
    //Testing the login route
    test('successful login test', async () => {
      //Testing the successful login
      await request(app)
        .post('/api/login')
        .send({ username, password }) //Sending the username and password in the request body
        .then(res => {
          expect(res.status).toBe(200); //Checking if the status code is 200
        });
    });
    test('failed login test', async () => {
      //Testing the failed login
      await request(app)
        .post('/api/login')
        .send({ username: 'notInDB', password: 'Fred' }) //Sending a username that is not in the database
        .then(res => {
          expect(res.status).toBe(400); //Checking if the status code is 400
        });
    });
  });
  describe('Testing the deposit route', () => {
    //Testing the deposit route
    test('successful deposit test', async () => {
      //Testing the successful deposit
      await request(app)
        .put('/api/deposit')
        .send({ username, password, amount: 5000 }) //Sending the username, password and amount in the request body
        .then(res => {
          expect(res.status).toBe(201); //Checking if the status code is 201
        });
    });
    test('failed deposit test', async () => {
      //Testing the failed deposit
      await request(app)
        .put('/api/deposit')
        .send({ username, password, amount: '0' }) //sending an amount less than 1
        .then(res => {
          expect(res.status).toBe(400); //Checking if the status code is 400
        });
    });
  });
  describe('Testing the transfer route', () => {
    //Testing the transfer route
    test('successful transfer test', async () => {
      //Testing the successful transfer
      await request(app)
        .put('/api/transfer')
        .send({
          username,
          password,
          recipient,
          amount: 1000
        }) //Sending the username, password, recipient and amount in the request body
        .then(res => {
          expect(res.status).toBe(201); //Checking if the status code is 201
        });
    });
    test('failed transfer test', async () => {
      await request(app)
        .put('/api/transfer')
        .send({
          username,
          password,
          recipient,
          amount: '10000'
        }) //Sending an amount greater than the one deposited
        .then(res => {
          expect(res.status).toBe(400); //Checking if the status code is 400
        });
    });
  });
  describe('Testing the find route', () => {
    //Testing the find route
    test('successful find test', async () => {
      //Testing the successful find
      await request(app)
        .get(`/api/find/${recipient}`) //Sending the username in the request parameters
        .then(res => {
          expect(res.status).toBe(200); //Checking if the status code is 200
        });
    });
    test('failed find test', async () => {
      //Testing the failed find route
      await request(app)
        .get(`/api/find/userNotInDB`) //Sending a username that is not in the database
        .then(res => {
          expect(res.status).toBe(400); //Checking if the status code is 400
        });
    });
  });
});