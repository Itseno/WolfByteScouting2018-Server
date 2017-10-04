var express = require('express');
var router = express.Router();
var robot = require('./robot.js')
var user = require('./user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use('/user', user);
router.use('/robot', robot);

module.exports = router;
