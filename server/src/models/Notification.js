import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: "true"
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: [
                "NEW_APPLICATION",
                "APPLICATION_ACCEPTED",
                "APPLICATION_REJECTED",
                "NEW_JOB",
                "SYSTEM"
            ]
        },

        isRead: {
            type: Boolean,
            default: false
        }

    }, { timeStamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
