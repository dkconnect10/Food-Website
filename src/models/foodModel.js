import mongoose, { Schema } from "mongoose";

const foodSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Food title is require"],
    },
    description: {
      type: String,
      required: [true, "Food description is require"],
    },
    price: {
      type: Number,
      required: [true, "Food price is require"],
    },
    foodTags: {
      type: String,
    },
    category: {
      type: String,
    },
    code: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    resturant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    ratingCount: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Food = mongoose.model("Food", foodSchema);

export  {Food}