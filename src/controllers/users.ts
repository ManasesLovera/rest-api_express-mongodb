import { Request, Response} from 'express';
import { deleteUserById, getUsers, getUserById } from '../db/users';
import { authentication } from '../helpers';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json( { message: error.message } );
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const existingUser = await getUserById(id);

        if (!existingUser) 
            return res.status(404).json( { message: 'User not found' } );

        const deletedUser = await deleteUserById(id);

        return res.status(200).json( { message: "Deleted successfully"} );
    }
    catch (error) {
        return res.status(500).json( { message: error.message } );
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;

        if (!username || !email) 
            return res.status(400).json( { message: 'Missing username' } );

        const user = await getUserById(id);

        user.username = username;
        user.email = email;
        await user.save();

        return res.status(200).json(user).end();
    }
    catch (error) {
        return res.status(500).json( { message: error.message } );
    }
}

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        const user = await getUserById(id).select('+authentication.salt +authentication.password');

        if(user.authentication.password !== authentication(user.authentication.salt, currentPassword)) 
            return res.status(401).json( { message: 'Wrong password'});

        user.authentication.password = authentication(user.authentication.salt, newPassword);
        await user.save();

        return res.status(200).json( { message: 'Password updated' }).end();
        
    }
    catch (error) {
        return res.status(500).json( { message: error.message } );
    }
}