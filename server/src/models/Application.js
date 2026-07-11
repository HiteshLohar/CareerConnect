import mongoose from 'mongoose';

const applicationSchema = mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Rejected', 'Accepted'],
        default: 'Pending'
    }
}, { timestamps: true });

applicationSchema.index(
    { job: 1, student: 1 },
    { unique: true }
);


const Application = mongoose.model("Application", applicationSchema);

export default Application;