import { generateNonce } from "siwe";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import type { NextApiRequest, NextApiResponse } from "next";
import {SessionData} from "@/types/session-data";
import {withMethod} from "@/lib/middleware";


async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  session.nonce = generateNonce();
  await session.save();
  res.status(200).json({ nonce: session.nonce });
}

export default withMethod('GET', handler);
