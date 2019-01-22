import UserValidation from './user';
import MessageValidation from './message';
import GroupValidation from './group';

module.exports = {
  user: new UserValidation(),
  message: new MessageValidation(),
  group: new GroupValidation()
};