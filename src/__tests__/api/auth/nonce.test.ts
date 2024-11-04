import { vi } from 'vitest';
import { generateNonce } from 'siwe';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/auth/nonce';

const mockSession = {
    nonce: '',
    save: vi.fn().mockResolvedValue(null),
};

vi.mock('iron-session', () => ({
    getIronSession: vi.fn(() => mockSession),
}));

vi.mock('siwe', () => ({
    generateNonce: vi.fn(() => 'mock-nonce'),
}));

const mockRequestResponse = () => {
    const req = {
        method: 'GET',
    } as Partial<NextApiRequest>;

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
    } as Partial<NextApiResponse>;

    return { req: req as NextApiRequest, res: res as NextApiResponse };
};

beforeEach(() => {
    vi.clearAllMocks();
    mockSession.nonce = '';
});

describe('GET /api/auth/nonce', () => {
    it('should return 405 if method is not GET', async () => {
        const { req, res } = mockRequestResponse();
        req.method = 'POST';

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.json).toHaveBeenCalledWith({ message: 'Method not allowed' });
    });

    it('should generate a nonce, save it in the session, and return 200 with the nonce', async () => {
        const { req, res } = mockRequestResponse();

        await handler(req, res);

        expect(generateNonce).toHaveBeenCalled();
        expect(mockSession.nonce).toBe('mock-nonce');
        expect(mockSession.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ nonce: 'mock-nonce' });
    });
});
