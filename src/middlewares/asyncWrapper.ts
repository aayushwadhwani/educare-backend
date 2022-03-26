import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express-serve-static-core";

const asyncWrapper = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>
): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

export default asyncWrapper;
