import Message from '../models/message';
import BaseRepository from './base';

export default class MessageRepository extends BaseRepository {

  constructor() {
    super(Message)
  }
  
};