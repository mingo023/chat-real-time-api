export default class ResponseHandler {

  static returnSuccess(res, data) {
    return res.status(200).json({
      isSuccess: true,
      data
    });
  }
  
  static returnError(res, error) {
    return res.status(400).json({
      isSuccess: false,
      message: error.message,
      error: e.stack || e
    });
  }
  
  // server.use((e, req, res, next) => {
  //   return res.status(400).json({
  //     isSuccess: false,
  //     message: e.message,
  //     error: e.stack || e
  //   });
  // });
}
