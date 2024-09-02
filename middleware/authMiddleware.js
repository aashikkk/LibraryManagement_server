const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { sendErrorResponse } = require("../utils/responseHandler");
const dotenv = require("dotenv");

dotenv.config();

const protect = async (req, res, next) => {
    let token = null;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return sendErrorResponse(res, null, "You are not logged in!", 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        if (!user) {
            return sendErrorResponse(
                res,
                null,
                "The user belonging to this token no longer exists",
                401
            );
        }
        req.user = user;
        next();
    } catch (err) {
        const isTokenExpired = err.name === "TokenExpiredError";
        const message = isTokenExpired ? "Token has expired" : "Invalid token";
        return sendErrorResponse(res, err, message, 401);
    }
};

module.exports = protect;
