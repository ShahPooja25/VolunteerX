import mongoose from "mongoose";

const joinEventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const JoinEvent = mongoose.model("JoinEvent", joinEventSchema);

export default JoinEvent;
