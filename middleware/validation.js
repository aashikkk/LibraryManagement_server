const { body, validationResult } = require("express-validator");
const { sendErrorResponse } = require("../utils/responseHandler");

const registerValidation = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendErrorResponse(
                res,
                null,
                "Validation error",
                400,
                errors.array()
            );
        }
        next();
    },
];

const loginValidation = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendErrorResponse(
                res,
                null,
                "Validation error",
                400,
                errors.array()
            );
        }
        next();
    },
];

module.exports = { registerValidation, loginValidation };
