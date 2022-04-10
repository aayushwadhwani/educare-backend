import { Schema, model, Types } from "mongoose";
import Subject from "./Subject";
import User from "./User";

const assignmentSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide assignment name"],
            minlength: [4, "Minimum length of assignment name should be of length 4"],
            maxlength: [20, "Minimum length of assignment name should be of length 20"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Please provide assignment description"],
            maxlength: [200, "Max length of description can be of length 200"],
            trim: true,
        },
        subject: {
            type: Types.ObjectId,
            required: [true, "Please provide subject"],
            ref: Subject,
        },
        students: {
            type: [Types.ObjectId],
            required: [true, "Please provide students"],
            ref: User,
        },
        dueDate: {
            type: Date,
            required: [true, "Please provide dueDate"],
        },
        maxScore: {
            type: Number,
            default: 100,
        },
        pdfReference: {
            type: String,
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
    },
    { timestamps: true }
);

export default model("Assignment", assignmentSchema);
