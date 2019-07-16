const database = require('../database');
const Schema = database.Schema;
const { FileSchema } = require('./file');

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    description: {
      type: String,
      maxlength: 21845,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0.01,
      max: 99999,
    },
    photos: [FileSchema],
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

ProductSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

ProductSchema.set('toJSON', {
  getters: true,
});

ProductSchema.set('toObject', {
  getters: true,
});

const Product = database.model('product', ProductSchema);

module.exports = Product;
