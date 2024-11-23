import express from 'express';
import { registerUser, loginUser, getUserByEmail, getUsersByCompanyEmail, updateUser, deleteUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/:email', getUserByEmail);
userRouter.get('/company/:companyEmail', getUsersByCompanyEmail);
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.patch('/update', updateUser);
userRouter.delete('/delete/:email', deleteUser);

export default userRouter;
