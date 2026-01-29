const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    testimonial: {
      // ✅ Changed from 'description' to 'testimonial'
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false, // ✅ Made optional
    },
    imagePublicId: {
      type: String,
      required: false, // ✅ Made optional
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Client", clientSchema);
