
const couponSchema = mongoose.Schema(
    {
      couponCode: {
        type: String,
        required: true,
        unique: true,
      },
      value: {
        type: Number,
        required: true,
      },
      deleted: {
        type: Boolean,
        default: false,
      },
      createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
      updatedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      deletedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      expireIn: {
        type: Date,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
  
  const couponModel = mongoose.model("Coupon", couponSchema);
  export default couponModel;