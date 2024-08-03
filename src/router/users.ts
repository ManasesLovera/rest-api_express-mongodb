import { Router } from 'express';
import { getAllUsers, deleteUser, updateUser, updatePassword } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';

const router = Router();

router.get('/', isAuthenticated, getAllUsers);
router.delete('/:id', isAuthenticated, isOwner, deleteUser);
router.patch('/info/:id', isAuthenticated, isOwner, updateUser);
router.patch('/pass/:id', isAuthenticated, isOwner, updatePassword);

export default router;