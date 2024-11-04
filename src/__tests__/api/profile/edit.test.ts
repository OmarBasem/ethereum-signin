import {vi} from 'vitest';
import type {NextApiRequest, NextApiResponse} from 'next';
import handler from '@/pages/api/profile/edit';

const mockSession = {
    siwe: {address: '0x36B12dD15f681a5d6faED0792a924e42cA3023C3'},
    save: vi.fn().mockResolvedValue(null),
};

vi.mock('iron-session', () => ({
    getIronSession: vi.fn(() => mockSession),
}));

const mockRequestResponse = () => {
    const req = {
        method: 'PATCH',
        body: {},
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
    mockSession.siwe = {address: '0x36B12dD15f681a5d6faED0792a924e42cA3023C3'};
});

describe('PATCH /api/profile/update', () => {
    it('should return 405 if method is not PATCH', async () => {
        const {req, res} = mockRequestResponse();
        req.method = 'GET';

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.setHeader).toHaveBeenCalledWith('Allow', ['PATCH']);
        expect(res.json).toHaveBeenCalledWith({error: 'Method Not Allowed'});
    });

    it('should return 401 if user is not authenticated', async () => {
        mockSession.siwe = {address: ''};

        const {req, res} = mockRequestResponse();
        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: 'Unauthorized. Please log in.'});
    });

    it('should return 403 if ethAddress in body does not match session address', async () => {
        const {req, res} = mockRequestResponse();
        req.body = {ethAddress: '0xDifferentAddress', username: 'newUser', bio: 'Test bio'};

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({error: 'Forbidden: You can only edit your own profile.'});
    });
});
