import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import sanitizeHtml from 'sanitize-html';
import {withAuthentication, withMethod} from "@/lib/middleware";
import {postCharLimit} from "@/lib/constants";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {content} = req.body;
    if (!content || content.length > postCharLimit) {
        throw new Error("Content must be between 1 and 255 characters.");
    }
    const sanitizedContent = sanitizeHtml(content);
    const ethAddress = req.session.siwe.address;
    try {
        const post = await prisma.post.create({
            data: {
                content: sanitizedContent,
                userEthAddress: ethAddress
            },
        });
        res.status(201).json(post);
    } catch (error) {
        console.warn('Error creating post:', error);
        res.status(500).json({error: 'An error occurred while creating the post'});
    }
}

export default withMethod('POST', withAuthentication(handler));

