import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  proposedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', // or 'System' or null if it's automated
    required: false
  },
  offeredAmount: {
    type: Number,
    required: true
  },
  message: {
    type: String
  },
  response: {
    type: String // Company feedback, if any
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'countered'],
    default: 'pending'
  },
  counterOffer: {
    type: Number
  },
  finalAmountAgreed: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

BidSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Bid = mongoose.model("Bid", BidSchema);
export default Bid;
