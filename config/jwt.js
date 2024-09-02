const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateAccessToken = (user) => {
    console.log("User ", user);
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" } // 15 minutes
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" } // 7 days
    );
};

module.exports = { generateAccessToken, generateRefreshToken };
