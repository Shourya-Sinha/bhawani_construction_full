import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    budget: {
        type: Number,
        required: true,
        min: [1000, "Budget too low"],
    },
    projectFile: {
        type: String
    },
    attachments: [String],
    deadline: Date,
    bidClosingDate: Date,
    estimatedDuration: String,
    category: {
        type: String,
        enum: ['residential', 'commercial', 'industrial', 'renovation', 'other'],
        default: 'residential',
    },
    requirements: [String],
    details: {
        carpetArea: Number,
        location: String
    },
    priorityLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    bids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid'
    }],
    locationCoords: {
        lat: Number,
        lng: Number,
    },
    views: {
        type: Number,
        default: 0,
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
    }],
    status: {
        type: String,
        enum: ['open', 'reviewing', 'assigned', 'completed'],
        default: 'reviewing'
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    likesList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }],
    dislikesList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }],
    ratings: [{
        by: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
        stars: { type: Number, min: 1, max: 5 },
        feedback: String,
        createdAt: { type: Date, default: Date.now },
    }],
    averageRating: { type: Number, default: 0 },
});

// Update 
ProjectSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

// Open for Bidding
ProjectSchema.methods.isBiddingOpen = function () {
    if (!this.bidClosingDate) return true;
    return new Date() <= this.bidClosingDate && this.status === "open";
};

// Add Views
ProjectSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

// Find Open Projects
ProjectSchema.statics.getAvailableProjects = function () {
    return this.find({ status: 'open', isPublished: true });
};

ProjectSchema.methods.recalculateAverageRating = function () {
    const total = this.ratings.reduce((sum, r) => sum + r.stars, 0);
    this.averageRating = this.ratings.length ? (total / this.ratings.length).toFixed(2) : 0;
    return this.save();
};

const Project = mongoose.model("Project", ProjectSchema);
export default Project;