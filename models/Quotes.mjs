import mongoose from "mongoose";
const { Schema } = mongoose;

const QuotesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuotesSchema",
  },
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

const Quotes = mongoose.model("QuotesSchema", QuotesSchema);

export default Quotes;
