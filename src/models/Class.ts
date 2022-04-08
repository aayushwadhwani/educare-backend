import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import User from "./User";

const classSchema = new Schema(
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
            minlength: [3, "class name should be of atleast 3 characters long"],
            maxlength: [15, "class name should be of atmost 15 characters long"],
        },
        name: {
            type: String,
            required: [true, "Please provide class name"],
            minlength: [3, "class name should be of atleast 3 characters long"],
            maxlength: [15, "class name should be of atmost 15 characters long"],
        },
        students: {
            type: [mongoose.Types.ObjectId],
            ref: User,
            required: [true, "Please provide students list"],
        },
        teacher: {
            type: mongoose.Types.ObjectId,
            ref: User,
            required: [true, "Please provide teacher"],
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: User,
            required: [true, "Please provide created by"],
        },
        updatedBy: {
            type: mongoose.Types.ObjectId,
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

classSchema.pre("save", function (next) {
    this.uniqueName = this.name;
    console.log(this.uniqueName);
    next();
});

export default model("Class", classSchema);
