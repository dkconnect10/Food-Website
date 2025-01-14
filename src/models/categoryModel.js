import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    title: {
      type: String,
      require: [true, "category type is required"],
      default: "indian-Food",
      enum: ["Indian-Food", "Italian-Food", "Chinese-Food", "Fast-Food"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant", 
      required: true, 
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
