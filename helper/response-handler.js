export default class ResponseHandler {

  static returnSuccess(res, data) {
    let response = {
      isSuccess: true,
      ...data
    };
    return res.status(200).json(response);
  }

}
