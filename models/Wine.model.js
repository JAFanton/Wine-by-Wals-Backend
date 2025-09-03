const { Schema, model } = require("mongoose");

const wineSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please input the name of the wine"],
            trim: true,
        },
        type: {
            type: String,
            required: [true, "Please input the type of wine"],
            trim: true,
        },
        country: {
            type: String,
            required: [true, "Please input the country of origin"],
            trim: true,
        },
        region: {
            type: String,
            trim: true,
        },
        year: {
            type: Number,
        },
        flavours: {
            type: [String], //eg: ["Cherry", "Oak", "Vanilla"]
        },
        notes: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Please input the price of the wine"],
        },
        stock: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true, //Adds createdAt and updatedAt
    }
);

const Wine = model("Wine", wineSchema);

module.exports = Wine;