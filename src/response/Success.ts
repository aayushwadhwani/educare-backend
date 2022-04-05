import ApiResponse from "../utils/ApiResponse";

class SuccessResponse extends ApiResponse {
    constructor(data: { [x: string]: any }, statusCode: number, error: { [x: string]: any }) {
        super(statusCode, data, error);
    }
}

const successResponse = (data: { [x: string]: any }, statusCode: number = 200, error: { [x: string]: any } = {}) => {
    const sendSuccessResponse = new SuccessResponse(data, (statusCode = 200), error);
    return sendSuccessResponse;
};

export default successResponse;
