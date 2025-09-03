const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [
    {
      wine: {
        type: Schema.Types.ObjectId,
        ref: "Wine",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
  ],
  discountCode: {
    type: String,
    trim: true,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const Cart = model("Cart", cartSchema);
module.exports = Cart;
