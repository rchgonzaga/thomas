const database = require('../database');
const Schema = database.Schema;

const CustomerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    birthdate: {
      type: String,
    },
    gender: {
      type: String,
      enum: [
        "male",
        "female",
        null
      ],
    },
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

CustomerSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

CustomerSchema.set('toJSON', {
  getters: true,
});

CustomerSchema.set('toObject', {
  getters: true,
});

const Customer = database.model('customer', CustomerSchema);

module.exports = Customer;
