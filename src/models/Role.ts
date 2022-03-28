import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide role name"],
            index: {
                unique: true,
                partialFilterExpression: { isActive: { $eq: true } },
            },
            trim: true,
            lowercase: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            required: [true, "Please provide createdBy"],
            ref: "User",
        },
        updatedBy: {
            type: mongoose.Types.ObjectId,
            required: [true, "Please provide createdBy"],
            ref: "User",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Role", roleSchema);
