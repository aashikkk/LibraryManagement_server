const express = require("express");
const router = express.Router();

const {
    register,
    login,
    logout,
    logoutAll,
    accessToken,
} = require("../controller/authController");
const {
    registerValidation,
    loginValidation,
} = require("../middleware/validation");
const protect = require("../middleware/authMiddleware");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Invalid input
 */
router.post("/register", registerValidation, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginValidation, login);

/**
 * @swagger
 * /auth/access-token:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your-refresh-token
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Refresh token is required
 *       403:
 *         description: Invalid or expired refresh token
 */
router.post("/access-token", accessToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user by invalidating their refresh token
 *     tags: [Auth]
 *     headers:
 *       Authorization: Bearer <access-token>
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your-refresh-token
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: Refresh token is required
 *       403:
 *         description: Invalid refresh token
 */
router.post("/logout", protect, logout);

/**
 * @swagger
 * /auth/logout-all:
 *   get:
 *     summary: Logout a user from all devices
 *     tags: [Auth]
 *     headers:
 *       Authorization: Bearer <access-token>
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: User logged out from all devices successfully
 *       403:
 *         description: No refresh tokens found
 */
router.get("/logout-all", protect, logoutAll);

module.exports = router;
