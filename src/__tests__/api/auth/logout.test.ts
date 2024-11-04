import { vi } from 'vitest';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/auth/logout';

const mockSession = {
    destroy: vi.fn().mockResolvedValue(null),
};

vi.mock('iron-session', () => ({
    getIronSession: vi.fn(() => mockSession),
}));

const mockRequestResponse = () => {
    const req = {} as Partial<NextApiRequest>;
    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
    } as Partial<NextApiResponse>;

    return { req: req as NextApiRequest, res: res as NextApiResponse };
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe('POST /api/auth/logout', () => {
    it('should destroy the session and return 200 with a success message', async () => {
        const { req, res } = mockRequestResponse();

        await handler(req, res);

        expect(mockSession.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
    });
});
