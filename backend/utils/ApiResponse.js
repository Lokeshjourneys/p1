class ApiResponse {
    constructor(statusCode, message='Success', data = null, success = true, errors = []) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode< 400; // Indicates success if status code is less than 400
        this.errors = errors; // Array to hold validation or other errors
    }
}


ApiResponse.success = (data, message = 'Success') => {
    return new ApiResponse(200, message, data);
};
ApiResponse.created = (data, message = 'User created successfully') => {
    return new ApiResponse(201, message, data);
};
ApiResponse.noContent = (message = 'No content') => {
    return new ApiResponse(204, message);
};


export { ApiResponse };