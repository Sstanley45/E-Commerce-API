import mongoose from "mongoose";

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "please provide rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "please provide review title"],
      maxLength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provide review text"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

//To add a functionality that ensures user can leave only one review per product.
// There are two ways to achieve that, first there is indexing on the Schema, and secondly on the Controller
// in the Schema, we want to set a compound index meaning na index that entails multiple fields (e.g in email where we set unique : true)

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

//tracking the averageRating during deletion and creation of reviews-- here we use static methods
//which are created and called in the Schema other than being called in th controllers in the instances of the model

ReviewSchema.statics.calculateAverageRating = async function (productId) {
    console.log(productId);
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.product);
});

export default mongoose.model("Review", ReviewSchema);
