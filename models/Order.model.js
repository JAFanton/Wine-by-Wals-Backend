const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: "true",
  },
  items: [
    {
      wine: {
        type: Schema.Types.ObjectId,
        ref: "wine",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processed", "shipped"],
      default: "pending",
    },
    //To track payments
    paid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Order = model("order", orderSchema);

module.exports = Order;
