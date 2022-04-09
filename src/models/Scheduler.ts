import { Schema, model, Types } from "mongoose";
import Subject from "./Subject";
import User from "./User";

const schedulerSchema = new Schema(
    {
        subject: {
            type: Types.ObjectId,
            required: [true, "Please proide subject"],
            ref: Subject,
        },
        startTime: {
            type: Date,
            required: [true, "Please provide start time"],
        },
        endTime: {
            type: Date,
            required: [true, "Please provide end time"],
        },
        students: {
            type: [Types.ObjectId],
            ref: User,
            required: [true, "Please provide students"],
        },
        teacher: {
            type: Types.ObjectId,
            ref: User,
            required: [true, "Please provide teacher"],
        },
        createdBy: {
            type: Types.ObjectId,
            ref: User,
            required: [true, "Please provide created by"],
        },
        updatedBy: {
            type: Types.ObjectId,
            ref: User,
            required: [true, "Please provide teacher"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        link: {
            type: String,
        },
    },
    { timestamps: true }
);

export default model("Scheduler", schedulerSchema);
