const express = require("express")
const { registerUser, confirmEmail, login} = require("../controllers/user")
const {authorize,access}= require("../middlewares/auth")

const router = express.Router()
/**
 * @swagger
 * /api/v1/user/register-user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               nationality:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               fullName: John Doe
 *               phoneNumber: 08097867899
 *               nationality: USA
 *               email: johndoe@example.com
 *               password: password123
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '400':
 *         description: Invalid request payload
 *       '500':
 *         description: Server error
 */

router.post("/register-user",registerUser)
/**
 * @swagger
 * /api/v1/user/confirm-email:
 *   post:
 *     summary: Confirm user email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - confirmationCode
 *             properties:
 *               confirmationCode:
 *                 type: number
 *             example:
 *               confirmationCode: 123456
 *     responses:
 *       '200':
 *         description: User email successfully confrimed
 *       '400':
 *         description: Invalid request payload
 *       '500':
 *         description: Server error
 */
router.post("/confirm-email",confirmEmail)

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Log in user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: johndoe@example.com
 *               password: password123
 *     responses:
 *       '200':
 *         description: User email successfully confrimed
 *       '400':
 *         description: Invalid request payload
 *       '500':
 *         description: Server error
 */

router.post("/login",login)


module.exports = router