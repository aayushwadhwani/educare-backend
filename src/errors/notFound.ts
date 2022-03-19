import { NextFunction, Request, Response } from "express";
import createError from "../response/fail";

const notFound = (req: Request, res: Response, next: NextFunction) => {
    return next(createError(`Cannot find ${req.method} ${req.originalUrl} on this server`));
};

export default notFound;
