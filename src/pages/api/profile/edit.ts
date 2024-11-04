import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import {getIronSession} from 'iron-session';
import {sessionOptions} from '@/lib/session';
import {SessionData} from "@/types/session-data";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PATCH') {
        return res.setHeader('Allow', ['PATCH']).status(405).json({error: 'Method Not Allowed'});
    }
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    if (!session.siwe || !session.siwe.address) {
        return res.status(401).json({error: 'Unauthorized. Please log in.'});
    }
    const {ethAddress, username, bio} = req.body;
    if (ethAddress !== session.siwe.address) {
        return res.status(403).json({error: 'Forbidden: You can only edit your own profile.'});
    }
    try {
        const existingUser = await prisma.user.findUnique({where: {username}});
        if (existingUser && existingUser.ethAddress !== session.siwe.address) {
            return res.status(409).json({error: 'Username is already in use'});
        }
        const updatedUser = await prisma.user.update({
            where: {ethAddress},
            data: {username, bio},
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({error: 'Failed to update profile'});
    }
}
