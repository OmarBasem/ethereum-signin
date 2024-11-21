import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

export function withMethod(method: string, handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== method) {
      res.setHeader('Allow', [method]);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    return handler(req, res);
  };
}
