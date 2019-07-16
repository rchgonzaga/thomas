const AbstractEntityRepository = require('./abstractEntityRepository');
const MongooseQuery = require('../utils/mongooseQuery');
const AuditLogRepository = require('./auditLogRepository');
const Order = require('../models/order');

class OrderRepository extends AbstractEntityRepository {
  async create(data, options) {
    await Order.createCollection();
    const [record] = await Order.create(
      [
        {
          ...data,
          createdBy: this.getCurrentUser(options).id,
          updatedBy: this.getCurrentUser(options).id,
        },
      ],
      this.getSessionOptionsIfExists(options),
    );

    await this._auditLogs(
      AuditLogRepository.CREATE,
      record.id,
      data,
      options,
    );

    await this.refreshTwoWayRelations(record, options);

    return this.findById(record.id, options);
  }

  async update(id, data, options) {
    await this.wrapWithSessionIfExists(
      Order.updateOne(
        { _id: id },
        {
          ...data,
          updatedBy: this.getCurrentUser(options).id,
        },
      ),
      options,
    );

    await this._auditLogs(
      AuditLogRepository.UPDATE,
      id,
      data,
      options,
    );

    const record = await this.findById(id, options);
    await this.refreshTwoWayRelations(record, options);
    return record;
  }

  async destroy(id, options) {
    await this.wrapWithSessionIfExists(
      Order.deleteOne({ _id: id }),
      options,
    );

    await this._auditLogs(
      AuditLogRepository.DELETE,
      id,
      null,
      options,
    );

    await this.destroyFromRelations(id, options);
  }

  async count(filter, options) {
    return this.wrapWithSessionIfExists(
      Order.countDocuments(filter),
      options,
    );
  }

  async refreshTwoWayRelations(record, options) {

  }

  async destroyFromRelations(id, options) {

  }

  async findById(id, options) {
    return this.wrapWithSessionIfExists(
      Order.findById(id)
      .populate('customer')
      .populate('products')
      .populate('employee'),
      options,
    );
  }

  async findAndCountAll(
    {
      requestedAttributes,
      filter,
      limit,
      offset,
      orderBy,
    } = {
      requestedAttributes: null,
      filter: null,
      limit: 0,
      offset: 0,
      orderBy: null,
    },
    options,
  ) {
    const query = MongooseQuery.forList({
      limit,
      offset,
      orderBy: orderBy || 'createdAt_DESC',
    });

    if (filter) {
      if (filter.id) {
        query.appendId('_id', filter.id);
      }

      if (filter.customer) {
        query.appendId('customer', filter.customer);
      }

      if (filter.employee) {
        query.appendId('employee', filter.employee);
      }

      if (filter.createdAtRange) {
        query.appendRange(
          'createdAt',
          filter.createdAtRange,
        );
      }
    }

    const rows = await Order.find(query.criteria)
      .skip(query.skip)
      .limit(query.limit)
      .sort(query.sort)
      .populate('customer')
      .populate('products')
      .populate('employee');

    const count = await Order.countDocuments(query.criteria);

    return { rows, count };
  }

  async findAllAutocomplete(search, limit) {
    let query = MongooseQuery.forAutocomplete({
      limit,
      orderBy: 'id_ASC',
    });

    if (search) {
      query.appendId('_id', search);

    }

    const records = await Order.find(query.criteria)
      .limit(query.limit)
      .sort(query.sort);

    return records.map((record) => ({
      id: record.id,
      label: record['id'],
    }));
  }

  async _auditLogs(action, id, data, options) {
    await AuditLogRepository.log(
      {
        entityName: Order.modelName,
        entityId: id,
        action,
        values: data,
      },
      options,
    );
  }
}

module.exports = OrderRepository;
