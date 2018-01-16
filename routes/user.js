var express = require('express');
var router = express.Router();
var http = require('http');
var url = require('url');
var util = require('util');
var bodyParser = require('body-parser')
var ObjectID = require('mongodb').ObjectID;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_db');

var userSchema = mongoose.Schema({
  username: String,
  submitted: Number,
  userID: String
});

var User = mongoose.model("User", userSchema);

//Creates a scout, allowing them to simply enter their name on front end to
//begin. Scouts will not have the ability to sign themselves up, the scouting
//leader will have to do this before the match via curl requests.
router.post('/createUser', function(req, res){
  if(!req.body) return res.send(400);
  var objID = new ObjectID();
  var newUser = new User({
    username: req.body["username"],
    submitted: 0,
    userID: objID
  });
  newUser.save(function(err, point){
    if(err) res.status(500).send(err);
    else res.status(200).send(point);
  });
});

//Allows the scout to make a post request with just their name. If their name
//matches a name on the server, they are allowed to start scouting.
router.post('/signIn', function(req, res){
    if(!req.body) return res.send(400);
    User.findOne({username: req.body["username"]}, function(error, user){
        if(user != null) res.status(200).send(user);
        else res.status(406).send({"ERROR": "NO ACCESS"});
    });
});

//Essentially does the same thing as the sign in request and will return a json
//user object. Just has a different name for my own sanity
router.post('/getUser', function(req, res){
  if(!req.body) return res.send(400);
  User.findOne({username: req.body["username"]}, function(error, user){
    if(user != null) res.status(200).send(user);
    else res.status(406).send({"ERROR": "USER DOESNT EXIST"});
  });
});
module.exports = router;
