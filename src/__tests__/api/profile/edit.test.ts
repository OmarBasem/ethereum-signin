import {vi} from 'vitest';
import handler from '@/pages/api/profile/edit';
import {mockRequestResponse, mockSession} from "../../__resources__";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

vi.mock('iron-session', () => ({
    getIronSession: vi.fn(() => mockSession),
}));

beforeEach(() => {
    mockSession.siwe = {address: '0x36B12dD15f681a5d6faED0792a924e42cA3023C3'};
});

describe('PATCH /api/profile/update', () => {
    it('should return 200', async () => {
        const {req, res} = mockRequestResponse('PATCH');
        const mockUser = {
            ethAddress: '0x36B12dD15f681a5d6faED0792a924e42cA3023C3',
            username: 'newUser',
            bio: 'Test bio'
        }
        req.body = mockUser;
        prisma.user.update = vi.fn().mockResolvedValue(mockUser);

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });
    it('should return 405 if method is not PATCH', async () => {
        const {req, res} = mockRequestResponse();

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.setHeader).toHaveBeenCalledWith('Allow', ['PATCH']);
        expect(res.json).toHaveBeenCalledWith({error: 'Method Not Allowed'});
    });

    it('should return 401 if user is not authenticated', async () => {
        mockSession.siwe = {address: ''};

        const {req, res} = mockRequestResponse('PATCH');
        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: 'Unauthorized. Please log in.'});
    });
});
