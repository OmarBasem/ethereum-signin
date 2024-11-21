import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import {SessionData} from "@/types/session-data";

export function withAuthentication(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    if (!session.siwe || !session.siwe.address) {
      return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    (req as NextApiRequest).session = session;
    return handler(req, res);
  };
}
