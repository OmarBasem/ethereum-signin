import { NextApiRequest, NextApiResponse } from 'next';
import { SiweMessage } from 'siwe';
import { PrismaClient } from '@prisma/client';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import type {SessionData} from "@/types/session-data";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.setHeader('Allow', ['POST']).status(405).json({ error: 'Method Not Allowed' });
    }
    const { message, signature } = req.body;
    try {
        const session = await getIronSession<SessionData>(req, res, sessionOptions);
        if (!session.nonce) {
            return res.status(422).json({ message: 'Nonce not found in session.' });
        }
        const siweMessage = new SiweMessage(message);
        const { data: verifiedMessage } = await siweMessage.verify({ signature, nonce: session.nonce });
        session.nonce = null;
        session.siwe = verifiedMessage;
        await session.save();
        const ethAddress = verifiedMessage.address;
        const user = await prisma.user.findUnique({ where: { ethAddress } });
        res.status(200).json({ message: 'Logged in successfully', user });
    } catch (error) {
        console.error('Login error:', error);
        const session = await getIronSession<SessionData>(req, res, sessionOptions);
        session.siwe = null;
        session.nonce = null;
        await session.save();
        res.status(500).json({ error: 'Server error' });
    }
}
