import { Router } from 'express';
import authRouter from './authRouter';
import users from './users';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', users);

export default router;