const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImagesSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
});

let Image = mongoose.model("Image", ImagesSchema);
module.exports = Image;
