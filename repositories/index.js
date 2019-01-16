import UserRepository from './user';
import GroupRepository from './group';

module.exports = {
  userRepository: new UserRepository(),
  groupRepository: new GroupRepository()
}