class ApiResponse {
    status: { code: number; message: "success" | "fail" | "error" };
    data: { [x: string]: any };
    error: { [x: string]: any };

    constructor(statusCode: number = 200, data: { [x: string]: any }, error: { [x: string]: any }) {
        this.status = { code: statusCode, message: "success" };
        this.data = data;
        this.error = error;
    }
}

export default ApiResponse;
