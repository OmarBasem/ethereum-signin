import {vi} from 'vitest';
import {PrismaClient} from '@prisma/client';
import handler from '@/pages/api/profile/create';
import {mockRequestResponse, mockSession} from "../../__resources__";

const prisma = new PrismaClient();

vi.mock('iron-session', () => ({
    getIronSession: vi.fn(() => mockSession),
}));

beforeEach(async () => {
    mockSession.siwe = {address: '0x36B12dD15f681a5d6faED0792a924e42cA3023C3'};
});

describe('POST /api/profile/create', () => {
    it('should return 405 if method is not POST', async () => {
        const {req, res} = mockRequestResponse();

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.setHeader).toHaveBeenCalledWith('Allow', ['POST']);
        expect(res.json).toHaveBeenCalledWith({error: 'Method Not Allowed'});
    });

    it('should return 401 if user is not authenticated', async () => {
        mockSession.siwe = {address: ''}

        const {req, res} = mockRequestResponse('POST');
        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: 'Unauthorized. Please log in.'});
    });

    it('should return 400 if username is not provided', async () => {
        const {req, res} = mockRequestResponse('POST');
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

        const {req, res} = mockRequestResponse('POST');
        req.body = {username: 'newUser', bio: 'Test bio', ethAddress: '00'};

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
    });
});
