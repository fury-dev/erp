import mongoose from "mongoose";
const ObjectId = mongoose.Schema.ObjectId;

const Schema = new mongoose.Schema({
  deleted: Boolean,
  productId: {
    type: Number,
    unique: true,
  },
  productSchemaId: {
    type: ObjectId,
    required: [true, "Product required"],
  },
  versions: [
    {
      versionId: {
        type: Number,
        default: 1,
      },
      quantity: Number,
      size: String,
      inStock: Boolean,
      image: String,
      createdAt: { type: Date, default: Date.now },
      deleted: Boolean,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const controller = mongoose.model("product", Schema);
export default { controller };
