import UserRepository from './user';
import GroupRepository from './group';
import MessageRepository from './message';

module.exports = {
  userRepository: new UserRepository(),
  groupRepository: new GroupRepository(),
  messageRepository: new MessageRepository()
}