class Response {

    static success(statusCode, message, data = null, token = null) {
        return {
            status: true,
            statusCode,
            message,
            data,
            token,
            timestamp: new Date().toISOString()
        };
    }

    static error(statusCode, message, errors = null) {
        return {
            status: false,
            statusCode,
            message,
            errors,
            timestamp: new Date().toISOString()
        };
    }
}

export default Response;