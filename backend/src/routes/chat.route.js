import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getStreamToken } from '../controllers/chat.controller.js';
import { generateStreamToken } from '../lib/stream.js';

const router = express.Router();

router.get('/token', protectRoute, getStreamToken);

// Development-only debug route: generate a Stream token without auth/DB.
router.get('/debug-token', (req, res) => {
	if (process.env.NODE_ENV !== 'development') {
		return res.status(403).json({ msg: 'Forbidden' });
	}

	const userId = req.query.userId || 'dev-user';
	try {
		const token = generateStreamToken(userId);
		if (!token) return res.status(500).json({ msg: 'Failed to generate token' });
		return res.status(200).json({ token });
	} catch (error) {
		console.error('Debug token generation error:', error);
		return res.status(500).json({ msg: 'Server error' });
	}
});

export default router;