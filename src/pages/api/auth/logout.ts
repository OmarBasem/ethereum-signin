import { NextApiRequest, NextApiResponse } from 'next';
import {withAuthentication, withMethod} from "@/lib/middleware";


async function handler(req: NextApiRequest, res: NextApiResponse) {
    await req.session.destroy();
    res.status(200).json({ message: 'Logged out successfully' });
}

export default withMethod('POST', withAuthentication(handler));
