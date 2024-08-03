import { Request, Response, NextFunction } from 'express';
import { get, merge } from 'lodash';
import { getUserBySessionToken } from '../db/users';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionToken = req.cookies['USER-AUTH'];

        if (!sessionToken) 
            return res.status(401).json({ message: 'User is not authenticated' });
        
        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser) 
            return res.status(403).json({ message: 'User was not found' });

        merge(req, { identity: existingUser });

        return next();
    }
    catch (error) {
        return res.status(500).json({ message: error});
    }
}

export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if (!currentUserId) {
            return res.status(403).json({ message: "Error, please login again"}).end();
        }

        if (currentUserId.toString() !== id) {
            return res.status(403).json({ message: "you are not the owner of this account"}).end();
        }
        next();
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}