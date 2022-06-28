const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5001

const LaunchDarkly = require('launchdarkly-node-server-sdk');

var demoUsers = [];
var userDefault = {
  firstName: "admin",
  email: "admin@gmail.com",
  key: "admin",
  group: "admin"
}
var userOne = {
  firstName: "George",
  email: "george@acme.com",
  key: "one",
  group: "dev"
}
var userTwo = {
  firstName: "Sally",
  email: "sally@acme.com",
  key: "two",
  group: "testing"
}
var userThree = {
  firstName: "Bob",
  email: "bob@gmail.com",
  key: "three",
  group: "customer"
}
demoUsers.push(userOne, userTwo, userThree);

var ldClient = LaunchDarkly.init(
  process.env.LD_SDK_KEY, 
  userDefault
);

ldClient.on("ready", ()=>{
  express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => {
      var data = {
        user: '',
        allFlags: {},
        clientsideId: process.env.LD_CLIENTSIDE_ID
      };
      res.render('pages/index', data);
    })
    .get('/one', (req, res) => {
      ldClient.allFlagsState(userThree).then((allFlags) => {
        var data = {
          user: userThree,
          allFlags: allFlags,
          clientsideId: process.env.LD_CLIENTSIDE_ID
        };
        res.render('pages/one', data);
      });
    })
    .get('/two', (req, res) => {
      ldClient.allFlagsState(userTwo).then((allFlags) => {
        var data = {
          user: userTwo,
          allFlags: allFlags,
          clientsideId: process.env.LD_CLIENTSIDE_ID
        };
        res.render('pages/two', data);
      });
    })
    .get('/three', (req, res) => {
      ldClient.allFlagsState(userOne).then((allFlags) => {
        var data = {
          user: userOne,
          allFlags: allFlags,
          clientsideId: process.env.LD_CLIENTSIDE_ID
        };
        res.render('pages/three', data);
      });
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));
});