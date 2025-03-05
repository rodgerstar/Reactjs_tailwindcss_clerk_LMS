import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
    CourseId: {type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
    },
    userId: {
        type:String,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pendiing'
    }
}, {timestamps: true})

export const Purchase = mongoose.model('Purchase', PurchaseSchema)
