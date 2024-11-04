import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import {SessionData} from "@/types/session-data";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.setHeader('Allow', ['POST']).status(405).json({ error: 'Method Not Allowed' });
    }
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    if (!session.siwe || !session.siwe.address) {
        return res.status(401).json({error: 'Unauthorized. Please log in.'});
    }
    const { username, bio } = req.body;
    const ethAddress = session.siwe.address;
    if (!username) {
        return res.status(400).json({error: 'Username is required'});
    }
    try {
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ error: 'Username is already in use' });
        }
        const newUser = await prisma.user.create({
            data: {
                ethAddress,
                username,
                bio,
            },
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002' && (error.meta?.target as string[]).includes('ethAddress')) {
                return res.status(409).json({ error: 'ethAddress already exists' });
            }
        }
        res.status(500).json({ error: 'An error occurred while creating the user' });
    }
}
