const  multipleUploadMiddleware = require('../middleware/mutilpleUploadMiddleware');
let debug = console.log.bind(console);
const fs = require('fs');
const path = require("path");
//const pathUpload = 'upload_file'
const pathUpload = path.join(__dirname, '../../upload_file');
let multipleUpload = async (req, res) => {
  try {
    // thực hiện upload
    await multipleUploadMiddleware(req, res);
    // Nếu upload thành công, không lỗi thì tất cả các file của bạn sẽ được lưu trong biến req.files
    debug(req.files);
    // Mình kiểm tra thêm một bước nữa, nếu như không có file nào được gửi lên thì trả về thông báo cho client
    if (req.files.length <= 0) {
      return res.send(`You must select at least 1 file or more.`);
    }
    // trả về cho người dùng cái thông báo đơn giản.
    req.flash('infoHome', 'Your files has been uploaded.')
    return res.redirect('/');
  } catch (error) {
    // Nếu có lỗi thì debug lỗi xem là gì ở đây
    debug(error);
    // Bắt luôn lỗi vượt quá số lượng file cho phép tải lên trong 1 lần
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send(`Exceeds the number of files allowed to upload.`);
    }
    return res.send(`Error when trying upload many files: ${error}}`);
  }
};
module.exports = {
  multipleUpload: multipleUpload
};

module.exports.formupload = (req, res)=>{
  res.render("upload/upload");
}

module.exports.removeallfile = (req, res)=>{
  let totalFile = fs.readdirSync(pathUpload);
  for(let i=0; i< totalFile.length; i++){
    let datapath = pathUpload + '/' + totalFile[i];
    fs.unlinkSync(datapath);
  }
  req.flash('infoHome', 'Remove Done');  
  res.redirect('/');
}