import {vi} from 'vitest';
import handler from '@/pages/api/auth';
import type {NextApiRequest, NextApiResponse} from 'next';

const mockSession = {
    siwe: {address: '0x36B12dD15f681a5d6faED0792a924e42cA3023C5'},
    save: vi.fn().mockResolvedValue(null),
};

vi.mock('iron-session', () => ({
    getIronSession: vi.fn(() => mockSession),
}));


const mockRequestResponse = () => {
    const req = {
        method: 'GET',
    } as Partial<NextApiRequest>;

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        setHeader: vi.fn().mockReturnThis(),
    } as Partial<NextApiResponse>;

    return {req: req as NextApiRequest, res: res as NextApiResponse};
};

beforeEach(() => {
    vi.clearAllMocks();
    mockSession.siwe = {address: '0x36B12dD15f681a5d6faED0792a924e42cA3023C5'};
});

describe('GET /api/user', () => {
    it('should return 405 if method is not GET', async () => {
        const {req, res} = mockRequestResponse();
        req.method = 'POST';

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
