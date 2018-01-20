var express = require('express');
var router = express.Router();
var http = require('http');
var url = require('url');
var user = require('./user.js');
var util = require('util');
var bodyParser = require('body-parser')
var ObjectID = require('mongodb').ObjectID;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_db');


var robotSchema = mongoose.Schema({
  robotNumber: Number,
  scoutingReports: [{username: String, movesInAutoValue: Number, crossesAutoLineValue: Number, placesOnSwitchAutoValue: Number, placesOnSwitchAmountValue: Number, placesOnScaleAutoValue: Number, placesOnScaleAmountValue: Number, placesInExchangeAutoValue: Number, placesInExchangeAmountValue: Number, movesInTeleopValue: Number, placesOnSwitchTeleopValue: Number, placesOnScaleTeleopValue: Number, placesInExchangeTeleopValue: Number, getsOnPlatformValue: Number, climbedBarValue: Number, climbedOtherRobotValue: Number, supportedOtherRobotWhileClimbedValue: Number, supportedOtherRobotNotClimbedValue: Number, feedsFromPortalValue: Number, feedsFromGroundValue: Number, feedsFromExchangeValue: Number, commentsValue: String}]
}, {
  usePushEach: true
});

var Robot = mongoose.model("Robot", robotSchema);
var User = mongoose.model("User");

//Allows the user to submit a full scouting report
//Searches for the robot number, and if the robot has not been logged before
//an entry is created for the robot in the database
//Then, it adds a dict of the scouting report to the array of scouting reports
router.post('/addScoutingReport', function(req, res){
  if(!req.body) return res.send(400);
  Robot.findOne({robotNumber: req.body["robotNumber"]}, function(error, robot){
    if(robot == null)
    {
      var newRobot = new Robot({
        robotNumber: req.body["robotNumber"],
        scoutingReports: [{username: req.body["username"], movesInAutoValue: req.body["movesInAutoValue"], crossesAutoLineValue: req.body["crossesAutoLineValue"], placesOnSwitchAutoValue: req.body["placesOnSwitchAutoValue"], placesOnSwitchAmountValue: req.body["placesOnSwitchAmountValue"], placesOnScaleAutoValue: req.body["placesOnScaleAutoValue"], placesOnScaleAmountValue: req.body["placesOnScaleAmountValue"], placesInExchangeAutoValue: req.body["placesInExchangeAutoValue"], placesInExchangeAmountValue: req.body["placesInExchangeAmountValue"], movesInTeleopValue: req.body["movesInTeleopValue"], placesOnSwitchTeleopValue: req.body["placesOnSwitchTeleopValue"], placesOnScaleTeleopValue: req.body["placesOnScaleTeleopValue"], placesInExchangeTeleopValue: req.body["placesInExchangeTeleopValue"], getsOnPlatformValue: req.body["getsOnPlatformValue"], climbedBarValue: req.body["climbedBarValue"], climbedOtherRobotValue: req.body["climbedOtherRobotValue"], supportedOtherRobotWhileClimbedValue: req.body["supportedOtherRobotWhileClimbedValue"], supportedOtherRobotNotClimbedValue: req.body["supportedOtherRobotNotClimbedValue"], feedsFromPortalValue: req.body["feedsFromPortalValue"], feedsFromGroundValue: req.body["feedsFromGroundValue"], feedsFromExchangeValue: req.body["feedsFromExchangeValue"], commentsValue: req.body["commentsValue"]}]
      });
      newRobot.save(function(e, point){
        if(e) res.status(500).send(e);
        else {
          User.findOne({username: req.body["username"]}, function(err, user){
            user.submitted = user.submitted + 1;
            user.save();
          });
          res.status(200).send(point);
        }
      });
    }
    else {
      robot.scoutingReports.push({username: req.body["username"], movesInAutoValue: req.body["movesInAutoValue"], crossesAutoLineValue: req.body["crossesAutoLineValue"], placesOnSwitchAutoValue: req.body["placesOnSwitchAutoValue"], placesOnSwitchAmountValue: req.body["placesOnSwitchAmountValue"], placesOnScaleAutoValue: req.body["placesOnScaleAutoValue"], placesOnScaleAmountValue: req.body["placesOnScaleAmountValue"], placesInExchangeAutoValue: req.body["placesInExchangeAutoValue"], placesInExchangeAmountValue: req.body["placesInExchangeAmountValue"], movesInTeleopValue: req.body["movesInTeleopValue"], placesOnSwitchTeleopValue: req.body["placesOnSwitchTeleopValue"], placesOnScaleTeleopValue: req.body["placesOnScaleTeleopValue"], placesInExchangeTeleopValue: req.body["placesInExchangeTeleopValue"], getsOnPlatformValue: req.body["getsOnPlatformValue"], climbedBarValue: req.body["climbedBarValue"], climbedOtherRobotValue: req.body["climbedOtherRobotValue"], supportedOtherRobotWhileClimbedValue: req.body["supportedOtherRobotWhileClimbedValue"], supportedOtherRobotNotClimbedValue: req.body["supportedOtherRobotNotClimbedValue"], feedsFromPortalValue: req.body["feedsFromPortalValue"], feedsFromGroundValue: req.body["feedsFromGroundValue"], feedsFromExchangeValue: req.body["feedsFromExchangeValue"], commentsValue: req.body["commentsValue"]});
      robot.save(function(saveError, robotSaved){
        if(saveError) res.status(500).send(saveError);
        else {
          User.findOne({username: req.body["username"]}, function(err, user){
            user.submitted = user.submitted + 1;
            user.save();
          });
          res.status(200).send(robotSaved);
        }
      });
    }
  });
});

module.exports = router;
