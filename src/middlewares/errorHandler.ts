import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";

const errorHandlerMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || { code: 500, message: "error" };
    err.reason = {
        message: err.message,
    };
    res.status(err.status.code).json(err);
};

export default errorHandlerMiddleware;
