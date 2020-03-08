
'use strict';

/**
 * Usage: node upload.js PATH_TO_VIDEO_FILE
 */

const fs = require('fs');

const { google } = require('googleapis');
const { oauth2Client } = require('./authoApiGoogleController');
const path = require("path");
//const pathUpload = 'upload_file';

const pathUpload = path.join(__dirname, '../../upload_file');
var token_ = "token.json";
// initialize the Youtube API library

// very basic example of uploading a video to youtube
async function runSample(fileName) {
  const tokens = fs.readFileSync(token_, 'utf8')
  var x = JSON.parse(tokens);
  if (x.expiry_data < new Date().getTime()) {
    return 0;
  }

  oauth2Client.setCredentials(JSON.parse(tokens));

  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client
  });

  const pathdata = pathUpload + '/' + fileName;

  const res = await youtube.videos.insert(
    {
      part: 'id,snippet,status',
      notifySubscribers: false,
      requestBody: {
        snippet: {
          title: fileName.substring(0, fileName.length - 4),
          description: "Plants vs Zombies",
          tags: ["Plants vs Zombies 2", "pvz 2", "pvz", "zombile", "plants", "plants zombies", "plants vs zombies hack", "plants vs zombies garden"]
        },
        status: {
          privacyStatus: 'private',
        },
      },
      media: {
        body: fs.createReadStream(pathdata),
      },
    },
  );
  console.log('\n\n');
  console.log(res.data);
  return res.data;
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

var uploadyoutube = async(req, res, next)=>{
  try {
    let result;
    //lay ten tat ca file
    const totalFiles = fs.readdirSync(pathUpload);
    for (let i = 0; i < totalFiles.length; i++) {
      //lay duong dan
      result = await runSample(totalFiles[i]);
      await sleep(5000);
      if (result === 0) {
        return res.redirect('geturl');
      }
    }
    req.flash('infoHome', 'Post to youtube done');
    res.redirect('/');
  } catch (err) {
    next(err);
  }
}
module.exports = {
  runSample,
  uploadyoutube
};
