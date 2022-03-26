import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";

const errorHandlerMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || { code: 500, message: "error" };
    console.log(err);
    res.status(err.status.code).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
    });
};

export default errorHandlerMiddleware;
