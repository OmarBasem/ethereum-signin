import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import {withAuthentication, withMethod} from "@/lib/middleware";
import {bioCharLimit, ethAddressCharLimit, usernameCharLimit} from "@/lib/constants";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {ethAddress, username, bio} = req.body;
    try {
        const existingUser = await prisma.user.findUnique({where: {ethAddress}});
        if (existingUser && existingUser.ethAddress !== req.session.siwe.address) {
            return res.status(409).json({error: 'Username is already in use'});
        }
        if (username.length > usernameCharLimit || bio.length > bioCharLimit) {
            return res.status(400).json({
                error: 'Input validation failed',
                details: {
                    username: username.length > usernameCharLimit ? `Maximum length is ${usernameCharLimit}` : undefined,
                    bio: bio && bio.length > bioCharLimit ? `Maximum length is ${bioCharLimit}` : undefined,
                },
            });
        }
        const updatedUser = await prisma.user.update({
            where: {ethAddress},
            data: {username, bio},
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({error: 'Failed to update profile'});
    }
}

export default withMethod('PATCH', withAuthentication(handler));
