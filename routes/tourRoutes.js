const express = require('express') ;
const tourController = require('../controller/tourController') ;
const authController = require("../controller/authController") ;

const router = express.Router() ;
// param middleware
// router.param('id' , tourController.checkID) ;

const bodyCheckMiddleware = tourController.checkBody ;

router.route("/").get(authController.isTokenValid , tourController.getAllTours).post(bodyCheckMiddleware , tourController.createTour) ;
router.route("/top-5-cheap").get(tourController.aliasTopTours , tourController.getAllTours) ;
router.route('/tour-stats').get(tourController.getTourStats) ; 
router.route('/tour-months/:year').get(tourController.getMonthsTours) ;
router.route("/:id").get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour) ;
module.exports = router ;