import {vi} from 'vitest';
import handler from '@/pages/api/auth';
import {mockRequestResponse, mockSession} from "../../__resources__";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

vi.mock('iron-session', () => ({
    getIronSession: vi.fn(() => mockSession),
}));

describe('GET /api/auth', () => {
    it('should return 200', async () => {
        const mockUser = {id: '123', ethAddress: '0xMockAddress'};
        prisma.user.findUnique = vi.fn().mockResolvedValue(mockUser);
        const {req, res} = mockRequestResponse();

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });
    it('should return 405 if method is not GET', async () => {
        const {req, res} = mockRequestResponse('POST');

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.setHeader).toHaveBeenCalledWith('Allow', ['GET']);
        expect(res.json).toHaveBeenCalledWith({error: 'Method Not Allowed'});
    });

    it('should return 401 if user is not authenticated', async () => {
        mockSession.siwe = {address: ''};

        const {req, res} = mockRequestResponse();
        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: 'Not authenticated'});
    });
});
