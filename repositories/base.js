export default class BaseRepository {
  constructor(model) {
    this.model = model
  }

  getAll(options = {}) {
    const newOptions = {
      limit: 2,
      page: 1,
      where: {},
      sort: {
        createdAt: -1
      },
      lean: false,
      ...options
    };
    if (newOptions.limit > 10) {
      newOptions.limit = 10
    }
    newOptions.skip = (newOptions.page - 1) * newOptions.limit;
    if (newOptions.populate) {
      return this
        .model
        .find(newOptions.where)
        .skip(newOptions.skip)
        .limit(newOptions.limit)
        .populate(newOptions.populate)
        .sort(newOptions.sort)
        .select(newOptions.select)
        .lean(newOptions.lean);
    }
    return this
      .model
      .find(newOptions.where)
      .skip(newOptions.skip)
      .limit(newOptions.limit)
      .sort(newOptions.sort)
      .select(newOptions.select)
      .lean(newOptions.lean);
  };

  get(options = {}) {

    const newOptions = {
      where: {},
      sort: {
        _id: -1
      },
      lean: false,
      ...options
    }; 

    if (newOptions.populate) {
      return this
        .model
        .findOne(newOptions.where)
        .skip(newOptions.skip)
        .limit(newOptions.limit)
        .populate(newOptions.populate)
        .select(newOptions.select)
        .lean(newOptions.lean);
    };
    return this
      .model
      .findOne(newOptions.where)
      .skip(newOptions.skip)
      .limit(newOptions.limit)
      .select(newOptions.select)
      .lean(newOptions.lean);
  };

  findOneAndUpdate(options = {}) {
    return this
      .model
      .findOneAndUpdate(options.where, options.data)
      .lean(options.lean);
  }

  updateOne(option = {}) {
    return this 
      .model
      .updateOne(option.where, option.data)
  }

  aggregate(option = []) {
    return this
      .model
      .aggregate(option)
  }
  
  create(data = {}) {
    return new this.model(data);
  }
}