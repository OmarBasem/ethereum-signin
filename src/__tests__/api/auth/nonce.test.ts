import { vi } from 'vitest';
import { generateNonce } from 'siwe';
import handler from '@/pages/api/auth/nonce';
import {mockRequestResponse, mockSession} from "../../__resources__";

vi.mock('iron-session', () => ({
    getIronSession: vi.fn(() => mockSession),
}));

vi.mock('siwe', () => ({
    generateNonce: vi.fn(() => 'mock-nonce'),
}));

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
