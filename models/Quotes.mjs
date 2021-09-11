import mongoose from "mongoose";
const { Schema } = mongoose;

const QuotesSchema = new Schema({
  anime: {
    type: String,
    required: true,
  },
  quote: {
    type: String,
    required: true,
  },
  character: {
    type: String,
    required: true,
  },
});

export default mongoose.model("QuotesSchema", QuotesSchema);
