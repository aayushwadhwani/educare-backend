import { Schema, Types, model } from "mongoose";
import Class from "./Class";
import User from "./User";

const SubjectSchema = new Schema(
    {
        uniqueName: {
            type: String,
            required: [true, "Please provide class name"],
            index: {
                unique: true,
                partialFilterExpression: { isActive: { $eq: true } },
            },
            trim: true,
            lowercase: true,
            minlength: [3, "Subject name should be of atleast 3 characters long"],
            maxlength: [15, "Subject name should be of atmost 15 characters long"],
        },
        name: {
            type: String,
            required: [true, "Please provide class name"],
            minlength: [3, "Subject name should be of atleast 3 characters long"],
            maxlength: [15, "Subject name should be of atmost 15 characters long"],
        },
        class: {
            type: Types.ObjectId,
            ref: Class,
            required: [true, "Please provide class"],
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
    },
    { timestamps: true }
);

export default model("Subject", SubjectSchema);
