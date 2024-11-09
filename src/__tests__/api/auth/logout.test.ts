import { vi } from 'vitest';
import handler from '@/pages/api/auth/logout';
import {mockRequestResponse, mockSession} from "../../__resources__";

vi.mock('iron-session', () => ({
    getIronSession: vi.fn(() => mockSession),
}));

describe('POST /api/auth/logout', () => {
    it('should destroy the session and return 200 with a success message', async () => {
        const { req, res } = mockRequestResponse('POST');

        await handler(req, res);

        expect(mockSession.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
    });
});
