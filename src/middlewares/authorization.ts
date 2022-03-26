import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import createError from "../response/fail";

const authorization = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const message = "Unauthenticated no bearer";
        return next(createError(message, 401));
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload: jwt.JwtPayload | string | any = jwt.verify(token, process.env.JWT_SECRET!);
        const { userId, iat }: { userId: string; iat: number } = payload;
        const user = await User.findOne({ isActive: true, _id: userId })
            .select("name email gender role")
            .populate("role");
        if (!user) {
            const message = "Authentication failed";
            return next(createError(message, 401));
        }

        if (user.changedPasswordAfter(iat)) {
            const message = "Password changed recently, please login again";
            return next(createError(message, 401));
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        const message = "Authentication failed, Invalid JWt";
        return next(createError(message, 401));
    }
};

const restrictTo = (option: "admin" | "teacher" | "student") => {
    const errorMessage = "No permission to access this route";
    return (req: Request, res: Response, next: NextFunction) => {
        const { name: roleName } = req.user.role;
        console.log(roleName);
        if (!roleName) {
            return next(createError(errorMessage, 403));
        }
        if (roleName === "admin" && option === "admin") {
            return next();
        }
        if (roleName === "student" && option === "student") {
            return next();
        }
        if (roleName === "teacher" && option === "teacher") {
            return next();
        }
        return next(createError(errorMessage, 403));
    };
};

export { authorization, restrictTo };
