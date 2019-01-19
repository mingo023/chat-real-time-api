import Path from 'path';

import formidable from 'formidable';
import mime from 'mime-types';

const UploadController = {};

UploadController.getUpload = (req, res) => {
  res.sendFile(Path.resolve(__dirname, '..', 'index.html'));
}

UploadController.postUpload = (req, res, next) => {
  const form = new formidable.IncomingForm();
  
  form.parse(req);

  form.on('fileBegin', function (name, file) {
    const contentType = mime.lookup(file.name).split('/')[0];
    if (contentType === 'image') {
      file.path = Path.resolve(__dirname, '..', 'uploads/', file.name);
    } else {
      form.emit('error', 'Can not update this file!');
    }
  });

  form.on('error', function(err) {
    return next(err);
  });

  res.sendFile(Path.resolve(__dirname, '..', 'index.html'));
};

export default UploadController;