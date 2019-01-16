import Group from '../models/group';
import BaseRepository from './base';

export default class UserRepository extends BaseRepository {

  constructor() {
    super(Group)
  }
  
};