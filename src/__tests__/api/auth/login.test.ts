import { vi } from 'vitest';
import { SiweMessage } from 'siwe';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/auth/login';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockVerify = vi.fn();
SiweMessage.prototype.verify = mockVerify;

const mockSession = {
    nonce: 'sample-nonce',
    siwe: null,
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
        setHeader: vi.fn(),
    } as Partial<NextApiResponse>;

    return { req: req as NextApiRequest, res: res as NextApiResponse };
};

const createSiweMessage = (address: string, statement: string) => {
    const scheme = 'http';
    const domain = 'localhost:3000';
    const origin = 'http://localhost:3000';

    const message = new SiweMessage({
        scheme,
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: 1,
    });

    return message.prepareMessage();
};

beforeEach(() => {
    vi.clearAllMocks();
    mockSession.nonce = 'sample-nonce';
    mockSession.siwe = null;
});

describe('POST /api/auth/login', () => {
    it('should return 200 and save the session if SIWE verification is successful and user exists', async () => {
        const address = '0x36B12dD15f681a5d6faED0792a924e42cA3023C3';
        const message = createSiweMessage(address, 'Sign in with Ethereum to the app.');

        mockVerify.mockResolvedValue({
            data: { address },
        });

        prisma.user.findUnique = vi.fn().mockResolvedValue({ ethAddress: address });

        const { req, res } = mockRequestResponse();
        req.body = {
            message,
            signature: 'valid-signature',
        };

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(mockSession.save).toHaveBeenCalled();
    });

    it('should return 422 if nonce is not found in session', async () => {
        mockSession.nonce = '';

        const { req, res } = mockRequestResponse();
        req.body = {
            message: createSiweMessage('0x36B12dD15f681a5d6faED0792a924e42cA3023C3', 'Sign in with Ethereum'),
            signature: 'valid-signature',
        };

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Nonce not found in session.',
        });
    });

    it('should return 500 on server error', async () => {
        mockVerify.mockRejectedValue('Mocked rejected value');

        const { req, res } = mockRequestResponse();
        req.body = {
            message: createSiweMessage('0x36B12dD15f681a5d6faED0792a924e42cA3023C3', 'Error message'),
            signature: 'error-signature',
        };

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(mockSession.save).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            error: 'Server error',
        });
    });
});
