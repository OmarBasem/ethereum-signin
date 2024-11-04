import { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';
import { PrismaClient } from '@prisma/client';
import { sessionOptions } from '@/lib/session';
import {SessionData} from "@/types/session-data";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.setHeader('Allow', ['GET']).status(405).json({ error: 'Method Not Allowed' });
    }
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    if (!session.siwe || !session.siwe.address) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
        const user = await prisma.user.findUnique({ where: { ethAddress: session.siwe.address } });
        return user
            ? res.status(200).json(user)
            : res.status(404).json({ error: 'User not found' });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Server error' });
    }
}
