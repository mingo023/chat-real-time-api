import User from '../models/user';
import BaseRepository from './base';

export default class UserRepository extends BaseRepository {

  constructor() {
    super(User)
  }
  
};