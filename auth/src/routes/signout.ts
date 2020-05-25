import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  res.send('Health check!');
});

export { router as signoutRouter };
