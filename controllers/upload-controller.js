import Path from 'path';
import { ResponseHandler } from '../helper';
import formidable from 'formidable';

export default class UploadController {
  static async postFile(req, res, next) {
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
  }
}

