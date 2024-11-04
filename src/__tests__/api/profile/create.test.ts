import {vi} from 'vitest';
import {PrismaClient} from '@prisma/client';
import type {NextApiRequest, NextApiResponse} from 'next';
import handler from '@/pages/api/profile/create';

const prisma = new PrismaClient();

const mockSession = {
    siwe: {address: '0x36B12dD15f681a5d6faED0792a924e42cA3023C3'},
    save: vi.fn().mockResolvedValue(null),
};

vi.mock('iron-session', () => ({
    getIronSession: vi.fn(() => mockSession),
}));

const mockRequestResponse = () => {
    const req = {
        method: 'POST',
        body: {},
    } as Partial<NextApiRequest>;

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        setHeader: vi.fn().mockReturnThis(),
    } as Partial<NextApiResponse>;

    return {req: req as NextApiRequest, res: res as NextApiResponse};
};

beforeEach(async () => {
    vi.clearAllMocks();
    mockSession.siwe = {address: '0x36B12dD15f681a5d6faED0792a924e42cA3023C3'};
    await prisma.user.deleteMany({});
});

describe('POST /api/user/create', () => {
    it('should return 405 if method is not POST', async () => {
        const {req, res} = mockRequestResponse();
        req.method = 'GET';

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.setHeader).toHaveBeenCalledWith('Allow', ['POST']);
        expect(res.json).toHaveBeenCalledWith({error: 'Method Not Allowed'});
    });

    it('should return 401 if user is not authenticated', async () => {
        mockSession.siwe = {address: ''}

        const {req, res} = mockRequestResponse();
        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: 'Unauthorized. Please log in.'});
    });

    it('should return 400 if username is not provided', async () => {
        const {req, res} = mockRequestResponse();
        req.body = {bio: 'Test bio'};

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({error: 'Username is required'});
    });

    it('should return 201 and create a new user if data is valid', async () => {
        prisma.user.findUnique = vi.fn().mockResolvedValue(null);
        prisma.user.create = vi.fn().mockResolvedValue({
            ethAddress: '0x1234567890abcdef1234567890abcdef12345990',
            username: 'testuser',
            bio: 'This is a test bio',
            id: 'some-id',
            createdAt: new Date(),
        });

        const {req, res} = mockRequestResponse();
        req.body = {username: 'newUser', bio: 'Test bio', ethAddress: '00'};

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
    });
});
