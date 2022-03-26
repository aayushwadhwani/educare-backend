import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            first: {
                type: String,
                required: [true, "Please provide first name"],
                min: [3, "First name should be greater than 3"],
                max: [20, "First name should be at max of length 20"],
                trim: true,
            },
            last: {
                type: String,
                required: [true, "Please provide first name"],
                min: [3, "First name should be greater than 3"],
                max: [20, "First name should be at max of length 20"],
                trim: true,
            },
        },
        email: {
            type: String,
            required: [true, "Please provide email"],
            trim: true,
            match: [
                /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
                "Please provide valid email",
            ],
            index: {
                unique: true,
                partialFilterExpression: {
                    isActive: { $eq: true },
                },
            },
        },
        dateOfBirth: {
            type: Date,
            required: [true, "Please provide dateOfBirth"],
        },
        gender: {
            type: String,
            required: [true, "Please provide gender"],
            trim: true,
            enum: {
                values: ["male", "female", "other"],
                message: "Please provide from male, female, other",
            },
        },
        password: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        passwordChangedAt: {
            type: Date,
        },
        role: {
            type: mongoose.Types.ObjectId,
            ref: "Role",
            required: [true, "Please provide the role"],
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            required: [true, "Please provide created by"],
        },
        updatedBy: {
            type: mongoose.Types.ObjectId,
            required: [true, "Please provide modified by"],
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        this.passwordChangedAt = Date.now() - 2000;
    }

    if (this.isNew) {
        this.passwordChangedAt = undefined;
    }
    next();
});

export default mongoose.model("User", userSchema);
