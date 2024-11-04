import { generateNonce } from "siwe";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import type { NextApiRequest, NextApiResponse } from "next";
import {SessionData} from "@/types/session-data";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  session.nonce = generateNonce();
  await session.save();
  res.status(200).json({ nonce: session.nonce });
}
