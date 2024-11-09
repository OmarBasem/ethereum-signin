import { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.setHeader('Allow', ['POST']).status(405).json({ error: 'Method Not Allowed' });
    }
    const session = await getIronSession(req, res, sessionOptions);
    await session.destroy();
    res.status(200).json({ message: 'Logged out successfully' });
}
