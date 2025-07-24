import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getRecommendedUser, getMyFriends } from '../controllers/user.controller.js';
import { sendFriendRequest } from '../controllers/user.controller.js';
import { acceptFriendRequest } from '../controllers/user.controller.js';
import { getFriendRequests } from '../controllers/user.controller.js';
import { getOutgoingFriendRequests } from '../controllers/user.controller.js';
import { searchUserByEmail } from '../controllers/user.controller.js';
const router = express.Router();

router.get("/search", searchUserByEmail);
router.use(protectRoute);
// applies to all

router.get('/', getRecommendedUser);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);



export default router;
