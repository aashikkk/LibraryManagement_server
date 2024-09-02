const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { generateRefreshToken, generateAccessToken } = require("../config/jwt");
const {
    sendErrorResponse,
    sendSuccessResponse,
} = require("../utils/responseHandler");

const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({ name, email, password });
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        user.tokens = [{ token: refreshToken }];
        await user.save();
        const data = {
            accessToken,
            refreshToken,
            user: { id: user._id, name: user.name, email: user.email },
        };
        return sendSuccessResponse(
            res,
            data,
            "User registered successfully",
            201
        );
    } catch (err) {
        return sendErrorResponse(res, err, "Registration failed");
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return sendErrorResponse(res, null, "Invalid credentials", 401);
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        if (!user.tokens.some((t) => t.token === refreshToken)) {
            user.tokens.push({ token: refreshToken });
            await user.save();
        }
        const data = {
            accessToken,
            refreshToken,
            user: { id: user._id, name: user.name, email: user.email },
        };
        return sendSuccessResponse(
            res,
            data,
            "User logged in successfully",
            200
        );
    } catch (err) {
        return sendErrorResponse(res, err, "Login failed");
    }
};

const accessToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return sendErrorResponse(res, null, "Refresh Token is required", 400);
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user || !user.tokens.some((t) => t.token === refreshToken)) {
            return sendErrorResponse(res, null, "Invalid Refresh Token", 403);
        }

        const newAccessToken = generateAccessToken({
            _id: decoded.id,
            email: decoded.email,
        });

        const data = {
            accessToken: newAccessToken,
        };
        return sendSuccessResponse(
            res,
            data,
            "Token refreshed successfully",
            200
        );
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            const user = await User.findOne({ "tokens.token": refreshToken });

            if (user) {
                user.tokens = user.tokens.filter(
                    (t) => t.token !== refreshToken
                );
                await user.save();
            }
            return sendErrorResponse(
                res,
                err,
                "Refresh Token has expired",
                403
            );
        }
        return sendErrorResponse(res, err, "Invalid Refresh Token", 403);
    }
};

const logout = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return sendErrorResponse(res, null, "Refresh Token is required", 400);
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user || !user.tokens.some((t) => t.token === refreshToken)) {
            return sendErrorResponse(res, null, "Invalid Refresh Token", 403);
        }

        user.tokens = user.tokens.filter((t) => t.token !== refreshToken);
        await user.save();

        return sendSuccessResponse(
            res,
            null,
            "User logged out successfully",
            200
        );
    } catch (err) {
        return sendErrorResponse(res, err, "Invalid Refresh Token", 403);
    }
};

const logoutAll = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user || !user.tokens.length) {
            return sendErrorResponse(res, null, "No refresh tokens found", 403);
        }

        user.tokens = [];
        await user.save();

        return sendSuccessResponse(
            res,
            null,
            "User logged out from all devices successfully",
            200
        );
    } catch (err) {
        return sendErrorResponse(res, err, "Invalid Refresh Token", 403);
    }
};

module.exports = { register, login, accessToken, logout, logoutAll };
