export const apiResponse = (res, status, message, data = null, error = null) => {
    const response = {
        success: status >= 200 && status < 300,
        message,
        ...(data && { data }),
        ...(error && process.env.NODE_ENV === 'development' && { error })
    };
    return res.status(status).json(response);
};

export const errors = {
    notFound: (res, resource = 'Resource') =>
        apiResponse(res, 404, `${resource} not found`),
    conflict: (res, message = 'Conflict Occurred') =>
        apiResponse(res, 409, message),
    badRequest: (res, message = 'Invalid request', errors = null) =>
        apiResponse(res, 400, message, null, errors),
    unauthenticated: (res, message = 'Authentication required', errors = null) =>
        apiResponse(res, 401, message, null, errors),
    forbidden: (res, message = 'You are not authorized to do this', errors = null) =>
        apiResponse(res, 403, message, null, errors),
    serverError: (res, error = null) =>
        apiResponse(res, 500, 'Internal server error', null, error),
    unprocessable: (res, message = 'Validation failed', errors = null) =>
        apiResponse(res, 422, message, null, errors),
    tooManyRequests: (res, message, data = {}) => {
        return res.status(429).json({
            status: 'error',
            message,
            ...data
        });
    }
}