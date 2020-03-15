var fs = require("fs");
var token_ = "token.json";
var path = require("path");
var request = require("request");
const pathUpload = path.join(__dirname, '../../upload_file');
var changealbumId = "ACOfRuvCXQgH_P4mBcLzpJ5mkGLSNXezET_LGqqwFjrvfVcq7NTg0rl-UmywOnAx3cjQCOBhBtyn";
function uploadtoggphotos(tenfile, imgpath) {
    return new Promise(function (resolve, reject) {
        var base64str = fs.readFileSync(imgpath);
        //base64str = new Buffer(base64str, 'binary');
        request({
            method: 'post',
            headers: {
                'content-type': 'application/octet-stream',
                'Authorization': `Bearer ${userToken}`,
                'X-Goog-Upload-File-Name': tenfile,
                'X-Goog-Upload-Protocol': 'raw'
            },
            url: `https://photoslibrary.googleapis.com/v1/uploads`,
            rejectUnauthorized: false,
            body: base64str
        }, function (err, response, body) {
            console.log(body);
            let reqObject = {
                "albumId": changealbumId,
                newMediaItems: [
                    {
                        description: "Upload Video to Google Photos",
                        simpleMediaItem: {
                            uploadToken: body //Body is the upload token received from prev request
                        }
                    }
                ]
            };
            let reqObjectString = JSON.stringify(reqObject);

            request({
                method: 'post',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                url: `https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate`,
                rejectUnauthorized: false,
                body: reqObjectString
            }, function (err, response, result) {
                //console.log(result);
                resolve(result);
            });
        });
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.uploadvideotoggphotos = async (req, res) => {
    const tokens = fs.readFileSync(token_, 'utf8')
    var x = JSON.parse(tokens);
    if (x.expiry_data < new Date().getTime()) {
        return 0;
    }
    userToken = x.access_token;
    var arr = fs.readdirSync(pathUpload);
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].substring(0, arr[i].length - 4);
    }
    for (let i = 0; i < arr.length; i++) {
        const videoPath = pathUpload + "\\" + arr[i] + ".mp4";
        let result = await uploadtoggphotos(arr[i].substring(0, 13) + ".mp4", videoPath);
        console.log(result);
        await sleep(1000);
    }
    res.send("Upload to google photos done!")
}
