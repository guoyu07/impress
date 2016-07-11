'use strict';

global.api = {};
api.common = {};
api.jstp = {};

var dir = process.cwd();

api.vm = require('vm');
api.net = require('net');
api.util = require('util');
api.events = require('events');
require(dir + '/lib/api.common.js');
require(dir + '/lib/api.jstp.js');

var connection = api.jstp.connect('impress', '127.0.0.1', 3000);

connection.on('event', function(iface, event, args) {
  console.log('Event', event, 'on interface', iface);
  console.log('Data:', args);
});

setTimeout(function() {

  console.log('connecting');
  connection.handshake('example', 'user', 'passwordHash', function() {
    console.log('handshake done');
    connection.call('interfaceName', 'methodName', [1, 2, 3], function(res) {
      console.log('result1 received');
      console.dir(res);
    });
    connection.call('interfaceName', 'sendEvent', '', function(res) { });
    connection.call('interfaceName', 'methodName', [4, 5, 6], function(res) {
      console.log('result2 received');
      console.dir(res);
      connection.call('interfaceName', 'methodName', [7, 8, 9], function(res) {
        console.log('result3 received');
        console.dir(res);
        process.exit(0);
      });
    });
  });

}, 2000);
