import type {NextApiRequest, NextApiResponse} from "next";
import {vi} from "vitest";


export const mockRequestResponse = (method: string = 'GET') => {
    const req = {
        method,
    } as Partial<NextApiRequest>;

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        setHeader: vi.fn().mockReturnThis(),
    } as Partial<NextApiResponse>;

    return {req: req as NextApiRequest, res: res as NextApiResponse};
};

export const mockSession = {
    siwe: {address: '0x36B12dD15f681a5d6faED0792a924e42cA3023C5'},
    nonce: 'mock-nonce',
    save: vi.fn().mockResolvedValue(null),
    destroy: vi.fn().mockResolvedValue(null),
};
