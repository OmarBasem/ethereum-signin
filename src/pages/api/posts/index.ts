import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import {withAuthentication, withMethod} from "@/lib/middleware";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {cursor} = req.query;
    try {
        const user = await prisma.user.findUnique({
            where: {
                ethAddress: req.session.siwe.address,
            },
            include: {
                posts: {
                    take: 10,
                    skip: cursor ? 1 : 0,
                    cursor: cursor ? {id: cursor as string} : undefined,
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
        const posts = user?.posts || [];
        const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;
        return res.status(200).json({
            posts,
            nextCursor,
        });
    } catch (error) {
        console.warn('Error fetching posts:', error);
        res.status(500).json({error: 'Server error'});
    }
}

export default withMethod('GET', withAuthentication(handler));

