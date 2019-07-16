const database = require('../database');
const Schema = database.Schema;
const { FileSchema } = require('./file');

const OrderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'customer',
      required: true,
    },
    products: [{
      type: Schema.Types.ObjectId,
      ref: 'product',
      required: true,
      min: 1,
    }],
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    delivered: {
      type: Boolean,
      default: false
    },
    attachments: [FileSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    importHash: { type: String },
  },
  { timestamps: true },
);

OrderSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

OrderSchema.set('toJSON', {
  getters: true,
});

OrderSchema.set('toObject', {
  getters: true,
});

const Order = database.model('order', OrderSchema);

module.exports = Order;
