var express = require('express');
var router = express.Router();
var {uploadyoutube} = require("../controllers/uploadyoutubecontroller")
const multipleUploadController = require('../controllers/mutilpleUploadController');
const authoApiGoogleController = require('../controllers/authoApiGoogleController');
var uploadvideotoggphotos = require("../controllers/uploadvideotobloggerController");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', infoHome: req.flash("infoHome") });
});
router.get('/getapi', authoApiGoogleController.getapi)

router.get('/oauth2callback', authoApiGoogleController.oauth2callback)

router.get('/multiple-upload', multipleUploadController.formupload)

router.post('/multiple-upload', multipleUploadController.multipleUpload);

router.post('/removeallfileupload', multipleUploadController.removeallfile);

router.post("/uploadyoutube", uploadyoutube);

router.post("/uploadvideotoggphotos", uploadvideotoggphotos.uploadvideotoggphotos);

module.exports = router;
