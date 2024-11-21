import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import {withAuthentication, withMethod} from "@/lib/middleware";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const user = await prisma.user.findUnique({ where: { ethAddress: req.session.siwe.address } });
        return user
            ? res.status(200).json(user)
            : res.status(404).json({ error: 'User not found' });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default withMethod('GET', withAuthentication(handler));
