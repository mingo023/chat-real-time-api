import Path from 'path';
import { ResponseHandler } from '../helper';
import formidable from 'formidable';

import fs from 'fs';

import mime from 'mime-types';

const UploadController = {};

UploadController.getFile = async (req, res, next) => {
  try {

    const imageName = 'public/images/' + req.query.id;
    fs.readFile(imageName, (err, data) => {
      if (err) {
        return next(err);
      }
      res.end(data);
    });

  } catch (err) {
    return next(err);
  }
};

UploadController.postFile = async (req, res, next) => {
  try {

    const form = new formidable.IncomingForm();

    form.multiples = false;
    form.keepExtensions = false;
    form.maxFileSize = 20 * 1024 * 1024;
    form.uploadDir = Path.resolve(__dirname, '..', 'public/images');
    
    form.parse(req, (err, fields, files) => {
      if (err) {
        return next(err);
      }
    });

    form.on('fileBegin', function (name, file) {
      if (file.type.split('/')[0] !== 'image') {
        return next(new Error('Can not upload this file!'));
      }
      file.path = form.uploadDir + '/' + file.name;
    
      return ResponseHandler.returnSuccess(res, {
        file: file.name
      });

    });
    
  } catch (err) {
    return next(err);
  }
};

export default UploadController;
