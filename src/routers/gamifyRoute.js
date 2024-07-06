const express = require("express")
const { createChallenge, getChallenges, userChallenge, createProduct, createAchievement, createBadge, getUserAchievements} = require("../controllers/gamify")
const {authorize,access}= require("../middlewares/auth")

const router = express.Router()

/**
 * @swagger
 * /api/v1/gamify/create-challenge:
 *   post:
 *     summary: Create a challenge
 *     tags: [Gamify]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - points
 *               - targets
 *               - descriptions
 *               - type
 *             properties:
 *               points:
 *                 type: number
 *               target:
 *                 type: number
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *             example:
 *               points: 10
 *               target: 20
 *               type: Comment
 *               description : like 20 post
 *     responses:
 *       '201':
 *         description: challenge successfully created
 *       '400':
 *         description: Invalid request payload
 *       '500':
 *         description: Server error
 */
router.post("/create-challenge",createChallenge)

/**
 * @swagger
 * /api/v1/gamify/challenges:
 *   get:
 *     summary: Retrieve a paginated list of challenges
 *     tags: [Gamify]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of challenges per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to match in the description field
 *     responses:
 *       '200':
 *         description: A paginated list of challenges
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalDocs:
 *                       type: integer
 *                       example: 100
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pagingCounter:
 *                       type: integer
 *                       example: 1
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     prevPage:
 *                       type: integer
 *                       example: null
 *                     nextPage:
 *                       type: integer
 *                       example: 2
 *                 challenges:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 123456
 *                       points:
 *                         type: number
 *                         example: 10
 *                       target:
 *                         type: number
 *                         example: 20
 *                       description:
 *                         type: string
 *                         example: like 20 post
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Server error
 */

router.get("/challenges",getChallenges)

/**
 * @swagger
 * /api/v1/gamify/user-challenge/{challengeId}/{productId}:
 *   post:
 *     summary: Create or update user challenge progress
 *     tags: 
 *       - Gamify
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the challenge.
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product related to the challenge.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: Optional comment for the challenge progress (for Comment type challenges).
 *             example:
 *               comment: "This product is awesome!"
 *     responses:
 *       '201':
 *         description: User challenge progress updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: true
 *                 msg:
 *                   type: string
 *                   description: A message confirming the successful update of the user challenge progress.
 *                   example: User challenge progress updated successfully
 *                 data:
 *                   type: object
 *                   description: The updated user challenge object.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the user challenge.
 *                       example: 60b98d1bc1a47b001d58970a
 *                     user:
 *                       type: string
 *                       description: The ID of the user participating in the challenge.
 *                       example: 609d7b1aaf2349001f580a0b
 *                     challenge:
 *                       type: string
 *                       description: The ID of the challenge associated with the user challenge.
 *                       example: 609d7b1aaf2349001f580a0c
 *                     target:
 *                       type: integer
 *                       description: The target number of actions required to complete the challenge.
 *                       example: 20
 *                     progress:
 *                       type: integer
 *                       description: The current progress towards completing the challenge.
 *                       example: 10
 *                     status:
 *                       type: string
 *                       description: The status of the user challenge (Inprogress, Completed).
 *                       example: Inprogress
 *       '400':
 *         description: Invalid request payload or challenge not found
 *       '404':
 *         description: Challenge not found
 *       '500':
 *         description: Server error
 */


router.post("/user-challenge/:challengeId/:productId",authorize,userChallenge)

/**
 * @swagger
 * /api/v1/gamify/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               like:
 *                 type: integer
 *                 default: 0
 *             example:
 *               name: Product A
 *               like: 0
 *     responses:
 *       '201':
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: Product created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Invalid request payload
 *       '500':
 *         description: Server error
 */

router.post("/products",createProduct)

/**
 * @swagger
 * /api/v1/gamify/create-achievement:
 *   post:
 *     summary: Create a new achievement
 *     tags: 
 *       - Gamify
 *     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the achievement.
 *                 example: First Purchase
 *               points:
 *                 type: number
 *                 description: The points awarded for achieving this.
 *                 example: 10
 *               description:
 *                 type: string
 *                 description: A description of the achievement.
 *                 example: Complete your first purchase
 *               badge:
 *                 type: string
 *                 description: The ID of the badge associated with this achievement.
 *                 example: 60d21bda67c213e3ef0a53d2
 *     responses:
 *       '201':
 *         description: Achievement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Achievement'
 *       '400':
 *         description: Invalid input
 *       '500':
 *         description: Server error
 */

router.post("/create-achievement",createAchievement)

/**
 * @swagger
 * /api/v1/gamify/create-badge:
 *   post:
 *     summary: Create a new badge
 *     tags: 
 *       - Gamify
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the badge.
 *                 example: Gold Star
 *               description:
 *                 type: string
 *                 description: A description of the badge.
 *                 example: Awarded for outstanding performance
 *               icon:
 *                 type: string
 *                 description: The icon URL for the badge.
 *                 example: https://example.com/icons/gold-star.png
 *     responses:
 *       '201':
 *         description: Badge created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Badge'
 *       '400':
 *         description: Invalid input
 *       '500':
 *         description: Server error
 */
router.post("/create-badge",createBadge)

/**
 * @swagger
 * /api/v1/gamify/user-achievements:
 *   get:
 *     summary: Get all user achievements
 *     tags: 
 *       - Gamify
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: The number of achievements to retrieve per page.
 *     responses:
 *       '200':
 *         description: Successfully retrieved all user achievements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: true
 *                 msg:
 *                   type: string
 *                   description: A message confirming the successful retrieval of user achievements.
 *                   example: Successfully retrieved all user achievements
 *                 data:
 *                   type: object
 *                   description: Paginated list of user achievements
 *                   properties:
 *                     totalDocs:
 *                       type: integer
 *                       description: Total number of achievements.
 *                       example: 100
 *                     docs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: The unique identifier of the user achievement.
 *                             example: 60b98d1bc1a47b001d58970a
 *                           user:
 *                             type: string
 *                             description: The ID of the user.
 *                             example: 609d7b1aaf2349001f580a0b
 *                           achievement:
 *                             type: object
 *                             description: The associated achievement details.
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 description: The unique identifier of the achievement.
 *                                 example: 609d7b1aaf2349001f580a0c
 *                               name:
 *                                 type: string
 *                                 description: The name of the achievement.
 *                                 example: First Like
 *                               points:
 *                                 type: integer
 *                                 description: The points associated with the achievement.
 *                                 example: 10
 *                               description:
 *                                 type: string
 *                                 description: The description of the achievement.
 *                                 example: Achieve this by liking 10 posts.
 *                               badge:
 *                                 type: object
 *                                 description: The associated badge details.
 *                                 properties:
 *                                   _id:
 *                                     type: string
 *                                     description: The unique identifier of the badge.
 *                                     example: 609d7b1aaf2349001f580a0d
 *                                   name:
 *                                     type: string
 *                                     description: The name of the badge.
 *                                     example: Liker
 *                                   description:
 *                                     type: string
 *                                     description: The description of the badge.
 *                                     example: Awarded for liking 10 posts.
 *                                   icon:
 *                                     type: string
 *                                     description: The URL of the badge icon.
 *                                     example: http://example.com/icon.png
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The date and time when the user achievement was created.
 *                             example: 2021-05-01T14:48:00.000Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The date and time when the user achievement was last updated.
 *                             example: 2021-05-01T14:48:00.000Z
 *                     perPage:
 *                       type: integer
 *                       description: The number of achievements per page.
 *                       example: 20
 *                     currentPage:
 *                       type: integer
 *                       description: The current page number.
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages.
 *                       example: 5
 *       '400':
 *         description: Invalid request parameters
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server error
 */

router.get("/user-achievements",authorize,getUserAchievements)

module.exports = router