import { Request, Response } from 'express';
import { getUserByEmail, createUser } from '../db/users';
import { random, authentication } from '../helpers';

export const register = async (req: Request, res: Response) => {
    try 
    {
        const {email, password, username} = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ message: 'Missing data, it must contain username, email and password.'});
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.'});
        }

        const salt = random();
        const user = await createUser({
            email, 
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        })

        return res.status(200).json(user).end();
    }
    catch (error) 
    {
        console.log(error);
        return res.status(500).json({ message: `Server error: ${error.message} -> ${error}` });
    }
}

export const login = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;
        
        if (!email || !password) 
            return res.status(400).json({ message: 'Bad Request: Missing info' });

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if (!user)
            return res.status(404).json({ message: 'User not found' });

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash)
            return res.status(403).json({ message: 'Wrong password' });

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('USER-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/'});

        return res.status(200).json(user).end();
        
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }

}