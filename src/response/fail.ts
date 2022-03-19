import CustomError from "../utils/CustomError";

const createError = (message: string, statusCode: number = 500) => {
    return new CustomError(message, statusCode);
};

export default createError;
