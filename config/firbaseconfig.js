var FCM = require('fcm-node');
// var serverKey=require('privatekey.json');  //put the generated private key path here
var serverKey=require('./privatekey.json')
var fcm = new FCM(serverKey);
return fcm;
