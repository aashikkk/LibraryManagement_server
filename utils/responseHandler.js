const sendSuccessResponse = (
    res,
    data,
    message = "Success",
    statusCode = 200
) => {
    res.status(statusCode).json({
        status: "success",
        message,
        data,
    });
};

const sendErrorResponse = (
    res,
    err,
    message = "Error occurred",
    statusCode = 500,
    array
) => {
    res.status(statusCode).json({
        status: "error",
        message,
        error: array
            ? array.map((err) => err.msg).join(", ")
            : err
            ? err.message
            : null,
    });
};

module.exports = { sendSuccessResponse, sendErrorResponse };
