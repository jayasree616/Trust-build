const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: { 
      type: String,
      required: false,
      trim: true,
    },
    price: {  
      type: Number,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
