import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient, Prisma} from '@prisma/client';
import {withAuthentication, withMethod} from "@/lib/middleware";
import {bioCharLimit, ethAddressCharLimit, usernameCharLimit} from "@/lib/constants";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {username, bio} = req.body;
    const ethAddress = req.session.siwe.address;
    if (!username) {
        return res.status(400).json({error: 'Username is required'});
    }
    try {
        const existingUser = await prisma.user.findUnique({where: {username}});
        if (existingUser) {
            return res.status(409).json({error: 'Username is already in use'});
        }
        if (ethAddress.length > ethAddressCharLimit || username.length > usernameCharLimit || bio.length > bioCharLimit) {
            return res.status(400).json({
                error: 'Input validation failed',
                details: {
                    ethAddress: ethAddress.length > ethAddressCharLimit ? `Maximum length is ${ethAddressCharLimit}` : undefined,
                    username: username.length > usernameCharLimit ? `Maximum length is ${usernameCharLimit}` : undefined,
                    bio: bio && bio.length > bioCharLimit ? `Maximum length is ${bioCharLimit}` : undefined,
                },
            });
        }
        const newUser = await prisma.user.create({
            data: {
                ethAddress,
                username,
                bio,
            },
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002' && (error.meta?.target as string[]).includes('ethAddress')) {
                return res.status(409).json({error: 'ethAddress already exists'});
            }
        }
        res.status(500).json({error: 'An error occurred while creating the user'});
    }
}

export default withMethod('POST', withAuthentication(handler));

